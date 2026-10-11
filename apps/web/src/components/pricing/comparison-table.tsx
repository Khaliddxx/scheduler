import { MatrixMark } from '@/components/pricing/glyphs';
import { RIBBON, TABLE } from '@/components/pricing/copy';
import {
  comparisonMatrix,
  planColumns,
  popularPlan,
  type Cell,
} from '@/content/pricing';

/**
 * The full feature matrix.
 *
 * A real table, because that is what this is: `<caption>`, `scope="col"` on the
 * plan headers, `scope="row"` on every feature name and `scope="colgroup"` on the
 * section bands, so a screen-reader user can walk a cell and hear which feature on
 * which plan it belongs to. Column order comes from `planColumns`, so the table and
 * the cards above it can never disagree about the order of the ladder.
 *
 * Two things about the scrolling, both deliberate:
 *
 * 1. The panel scrolls HORIZONTALLY ONLY, and is not height-capped.
 *
 *    An earlier version capped the height so that `position: sticky` would work
 *    on the header row — sticky resolves against the nearest scrollport, and a
 *    horizontally scrollable wrapper is a scrollport in both axes, so a header
 *    stuck to the page viewport is not achievable inside one.
 *
 *    That reasoning is correct and the conclusion was still wrong. On a pricing
 *    page a height-capped matrix reads as the whole matrix: a visitor sees the
 *    first section, no affordance telling them four more exist, and never
 *    discovers the features that would have sold them the higher tier. A
 *    sticky header is not worth paying for with hidden content.
 *
 *    So: no cap, no sticky header. The feature-name column still sticks left,
 *    which is the one that matters — it is what makes the table readable while
 *    scrolling sideways on a phone. The page itself never scrolls sideways,
 *    because the scroll is contained here inside `.shell`.
 *
 * 2. The table uses `border-separate`, not the collapsed default. Collapsed borders
 *    belong to the table rather than to its cells, so they stay behind while a
 *    sticky cell moves and leave visible seams. Separated borders travel with the
 *    cell they are on.
 *
 * Sticky cells must be opaque or the rows show through them, which is why every one
 * of them carries `bg-bgInner` — the same colour as the panel, so the joins are
 * invisible until something scrolls under them.
 */

/** Feature name column plus one column per plan. */
const COL_COUNT = planColumns.length + 1;

const MARK_LABELS = { included: TABLE.included, notIncluded: TABLE.notIncluded };

function MatrixCell({ value }: { value: Cell | undefined }) {
  // An absent key is treated exactly like `false`: neutral, not a failure.
  if (value === undefined || typeof value === 'boolean') {
    return <MatrixMark present={value === true} labels={MARK_LABELS} />;
  }
  return <span className="text-muted">{value}</span>;
}

export function ComparisonTable() {
  return (
    <div className="card-lg overflow-hidden">
      <div className="scrollbar-slim overflow-x-auto">
        <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left">
          {/* The section above already carries a visible heading, so the caption is
              the table's accessible name rather than a second printed title. */}
          <caption className="sr-only">{TABLE.caption}</caption>

          <thead>
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-30 w-[240px] min-w-[240px] border-b border-line bg-bgInner px-5 py-4 align-bottom text-eyebrow uppercase text-dim sm:w-[320px]"
              >
                {TABLE.featureColumn}
              </th>

              {planColumns.map((col) => (
                <th
                  key={col.id}
                  scope="col"
                  className="min-w-[120px] border-b border-line bg-bgInner px-4 py-4 text-center align-bottom"
                >
                  <span className="block font-display text-body-sm font-semibold text-white">
                    {col.name}
                  </span>
                  {col.id === popularPlan.id ? (
                    <span className="mt-1 block text-eyebrow uppercase text-accent">
                      {RIBBON}
                    </span>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>

          {comparisonMatrix.map((section) => (
            <tbody key={section.title}>
              <tr>
                <th
                  scope="colgroup"
                  colSpan={COL_COUNT}
                  className="border-b border-line bg-bgLine p-0 text-left"
                >
                  {/* Sticks to the left edge so the band's label stays readable
                      while the plan columns scroll past it. */}
                  <span className="sticky left-0 block w-fit px-5 py-2.5 text-eyebrow uppercase text-white/75">
                    {section.title}
                  </span>
                </th>
              </tr>

              {section.rows.map((row) => (
                <tr key={row.label}>
                  <th
                    scope="row"
                    className="sticky left-0 z-10 border-b border-line bg-bgInner px-5 py-4 align-top font-normal"
                  >
                    <span className="block text-body-sm leading-[1.4] text-white">
                      {row.label}
                    </span>
                    {row.hint ? (
                      <span className="mt-1.5 block max-w-[40ch] text-body-xs leading-[1.45] text-dim">
                        {row.hint}
                      </span>
                    ) : null}
                  </th>

                  {planColumns.map((col) => (
                    <td
                      key={col.id}
                      className="border-b border-line px-4 py-4 text-center align-top text-body-sm"
                    >
                      <MatrixCell value={row.values[col.id]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
}
