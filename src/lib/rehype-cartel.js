import { visit, SKIP } from 'unist-util-visit';

/**
 * Transformations éditoriales appliquées à chaque fichier Markdown :
 *
 * 1. Une image seule dans son paragraphe, avec un titre, devient une figure
 *    légendée façon cartel :  ![Texte alternatif](./image.jpg "Artiste | Titre, date | Crédit")
 *    Les segments séparés par « | » deviennent des lignes de légende.
 *
 * 2. Une citation commençant par [!exergue] devient une citation mise en exergue
 *    (pull quote) :  > [!exergue] Une phrase forte tirée du texte.
 *
 * 3. Les notes de bas de page ([^1]) sont sorties du flux et placées dans
 *    une colonne de marge : <div class="texte">…</div><aside class="notes">…</aside>
 */
export function rehypeCartel() {
  return (tree) => {
    // 1. Figures légendées
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'p' || !parent || index === undefined) return;
      const meaningful = node.children.filter(
        (c) => !(c.type === 'text' && c.value.trim() === ''),
      );
      if (meaningful.length !== 1) return;
      const img = meaningful[0];
      if (img.type !== 'element' || img.tagName !== 'img') return;
      const title = img.properties?.title;
      if (!title) return;
      delete img.properties.title;
      img.properties.loading = 'lazy';
      const lines = String(title).split('|').map((s) => s.trim()).filter(Boolean);
      parent.children[index] = {
        type: 'element',
        tagName: 'figure',
        properties: { className: ['figure'] },
        children: [
          img,
          {
            type: 'element',
            tagName: 'figcaption',
            properties: { className: ['cartel-legende'] },
            children: lines.map((line, i) => ({
              type: 'element',
              tagName: 'span',
              properties: { className: [i === 0 ? 'l-premiere' : 'l-suite'] },
              children: [{ type: 'text', value: line }],
            })),
          },
        ],
      };
      return SKIP;
    });

    // 2. Exergues
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'blockquote') return;
      const firstP = node.children.find((c) => c.type === 'element' && c.tagName === 'p');
      const firstText = firstP?.children?.[0];
      if (firstText?.type === 'text' && firstText.value.trimStart().startsWith('[!exergue]')) {
        firstText.value = firstText.value.trimStart().replace('[!exergue]', '').trimStart();
        node.properties = { ...node.properties, className: ['exergue'] };
      }
    });

    // 3. Notes en marge
    const idx = tree.children.findIndex(
      (c) => c.type === 'element' && c.tagName === 'section' && c.properties?.dataFootnotes !== undefined,
    );
    const notes = idx >= 0 ? tree.children.splice(idx, 1)[0] : null;
    const texte = {
      type: 'element',
      tagName: 'div',
      properties: { className: ['texte'] },
      children: tree.children,
    };
    tree.children = [texte];
    if (notes) {
      notes.properties.className = ['notes-section'];
      tree.children.push({
        type: 'element',
        tagName: 'aside',
        properties: { className: ['notes'], ariaLabel: 'Notes' },
        children: [notes],
      });
    }
  };
}
