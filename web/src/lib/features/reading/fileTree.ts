// Paths as a tree of folders and files, the way an editor's explorer shows
// them: folders first, then files, each by name with a test just after the
// file it tests, and a folder holding just one folder shown as one,
// "src/lib", so a deep path doesn't stair-step.
export type TreeNode = { type: 'dir'; name: string; path: string; children: TreeNode[] } | { type: 'file'; name: string; path: string };

export function fileTree(paths: string[]): TreeNode[] {
	type Dir = { dirs: Map<string, Dir>; files: string[] };
	const root: Dir = { dirs: new Map(), files: [] };
	for (const path of paths) {
		const parts = path.split('/');
		let dir = root;
		for (const part of parts.slice(0, -1)) {
			if (!dir.dirs.has(part)) dir.dirs.set(part, { dirs: new Map(), files: [] });
			dir = dir.dirs.get(part)!;
		}
		dir.files.push(path);
	}

	const byName = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true });
	const isTest = (name: string) => /\.(test|spec)\.[^.]+$/.test(name);
	const subject = (name: string) => name.replace(/\.(test|spec)(\.[^.]+)$/, '$2');
	const byFile = (a: string, b: string) => byName(subject(a), subject(b)) || Number(isTest(a)) - Number(isTest(b)) || byName(a, b);
	function build(dir: Dir, prefix: string): TreeNode[] {
		const dirs = [...dir.dirs.entries()].sort(([a], [b]) => byName(a, b));
		const files = [...dir.files].sort((a, b) => byFile(a.slice(a.lastIndexOf('/') + 1), b.slice(b.lastIndexOf('/') + 1)));
		return [
			...dirs.map(([name, sub]): TreeNode => {
				let label = name;
				let path = prefix + name;
				// A folder holding only one folder joins up with it.
				while (sub.files.length === 0 && sub.dirs.size === 1) {
					const [[next, inner]] = sub.dirs.entries();
					label += `/${next}`;
					path += `/${next}`;
					sub = inner;
				}
				return { type: 'dir', name: label, path, children: build(sub, `${path}/`) };
			}),
			...files.map((path): TreeNode => ({ type: 'file', name: path.slice(path.lastIndexOf('/') + 1), path }))
		];
	}
	return build(root, '');
}

// The files of a tree, in the order it shows them.
export function treeOrder(nodes: TreeNode[]): string[] {
	return nodes.flatMap((n) => (n.type === 'file' ? [n.path] : treeOrder(n.children)));
}
