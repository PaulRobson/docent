import { describe, expect, it } from 'vitest';
import { fileTree, treeOrder } from './fileTree';

describe('fileTree', () => {
	it('puts folders before files, each by name', () => {
		const tree = fileTree(['b.ts', 'src/z.ts', 'a.ts', 'lib/x.ts']);
		expect(tree.map((n) => n.name)).toEqual(['lib', 'src', 'a.ts', 'b.ts']);
	});

	it('puts a test just after the file it tests', () => {
		const tree = fileTree(['src/b.ts', 'src/a.test.ts', 'src/a.ts', 'src/a.spec.ts', 'src/ab.ts']);
		expect(treeOrder(tree)).toEqual(['src/a.ts', 'src/a.spec.ts', 'src/a.test.ts', 'src/ab.ts', 'src/b.ts']);
	});

	it('joins a folder holding only one folder with it', () => {
		const tree = fileTree(['web/src/lib/a.ts', 'web/src/lib/b.ts', 'web/src/c.ts']);
		expect(tree).toEqual([
			{
				type: 'dir',
				name: 'web/src',
				path: 'web/src',
				children: [
					{
						type: 'dir',
						name: 'lib',
						path: 'web/src/lib',
						children: [
							{ type: 'file', name: 'a.ts', path: 'web/src/lib/a.ts' },
							{ type: 'file', name: 'b.ts', path: 'web/src/lib/b.ts' }
						]
					},
					{ type: 'file', name: 'c.ts', path: 'web/src/c.ts' }
				]
			}
		]);
	});

	it('keeps a lone file in its folder', () => {
		expect(fileTree(['a/b/c.ts'])).toEqual([{ type: 'dir', name: 'a/b', path: 'a/b', children: [{ type: 'file', name: 'c.ts', path: 'a/b/c.ts' }] }]);
	});

	it('lists files in the order it shows them', () => {
		expect(treeOrder(fileTree(['z.ts', 'a/y.ts', 'a/b/x.ts']))).toEqual(['a/b/x.ts', 'a/y.ts', 'z.ts']);
	});
});
