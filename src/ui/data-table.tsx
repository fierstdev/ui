import { ArrowDown, ArrowUp, ArrowUpDown, Search } from '@lucide/icons';
import { scope, type Ctx, type View } from '@fierst/aster';
import { Input } from './input.tsx';
import { Icon } from './icon.tsx';

const tableScope = scope`
  :scope { display: grid; gap: 0.85rem; min-width: 0; }
  .table-shell {
    border: 1px solid var(--aster-outline-variant);
    border-radius: var(--aster-radius-md);
    background: var(--aster-surface);
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.88rem;
  }

  /* Mobile-first stacked card layout (< 640px) */
  thead { display: none; }
  tbody { display: grid; }
  tbody tr {
    display: grid;
    gap: 0.4rem;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid var(--aster-outline-variant);
  }
  tbody tr:last-child { border-bottom: none; }
  tbody td {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0;
    border: none;
  }
  tbody td::before {
    content: attr(data-label);
    font-size: 0.74rem;
    font-weight: 650;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--aster-on-surface-variant);
  }
  tbody td.empty {
    display: block;
    padding: 1.5rem;
    text-align: center;
    color: var(--aster-on-surface-variant);
  }
  tbody td.empty::before { content: none; }

  /* Tabular layout at >= 640px */
  @media (min-width: 640px) {
    thead { display: table-header-group; }
    tbody { display: table-row-group; }
    tbody tr {
      display: table-row;
      padding: 0;
      border-bottom: none;
    }
    th, td {
      display: table-cell;
      text-align: left;
      padding: 0.7rem 0.9rem;
      border-bottom: 1px solid var(--aster-outline-variant);
    }
    tbody td::before { content: none; }
    tbody tr:last-child td { border-bottom: none; }
    tbody tr:hover { background: var(--aster-surface-low); }
    th {
      font-size: 0.76rem;
      font-weight: 650;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--aster-on-surface-variant);
      background: var(--aster-surface-low);
      white-space: nowrap;
    }
  }

  .sort-btn {
    border: none;
    background: transparent;
    color: inherit;
    font: inherit;
    text-transform: inherit;
    letter-spacing: inherit;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    cursor: pointer;
    padding: 0;
  }
  .sort-btn:hover { color: var(--aster-on-surface); }
  .mobile-sort {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-wrap: wrap;
    font-size: 0.78rem;
    color: var(--aster-on-surface-variant);
  }
  .mobile-sort-btn {
    border: 1px solid var(--aster-outline-variant);
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    border-radius: var(--aster-radius-control);
    padding: 0.25rem 0.6rem;
    font: inherit;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    cursor: pointer;
    touch-action: manipulation;
  }
  .mobile-sort-btn.is-sorted {
    background: var(--aster-primary-container);
    color: var(--aster-on-primary-container);
    border-color: transparent;
  }
  @media (min-width: 640px) {
    .mobile-sort { display: none; }
  }
`;

export interface ColumnDef<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => View;
}

export function* DataTable<T extends Record<string, any>>(
  props: {
    rows: readonly T[];
    columns: readonly ColumnDef<T>[];
    rowKey: (row: T) => string | number;
    searchable?: boolean;
    searchPlaceholder?: string;
    emptyText?: string;
    class?: string;
  },
  ctx: Ctx,
) {
  let query = '';
  let sortKey = '';
  let sortDir: 'asc' | 'desc' = 'asc';

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey = key;
      sortDir = 'asc';
    }
  };

  for (props of ctx) {
    const q = query.trim().toLowerCase();
    let visible = q
      ? props.rows.filter((row) =>
          Object.values(row).some((val) =>
            String(val ?? '')
              .toLowerCase()
              .includes(q),
          ),
        )
      : [...props.rows];

    if (sortKey) {
      visible = [...visible].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        const cmp =
          typeof av === 'number' && typeof bv === 'number'
            ? av - bv
            : String(av ?? '').localeCompare(String(bv ?? ''));
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }

    yield (
      <div class={[tableScope, props.class].filter(Boolean).join(' ')}>
        {props.searchable ? (
          <Input
            bind:value={query}
            placeholder={props.searchPlaceholder ?? 'Filter rows…'}
            leading={<Icon icon={Search} size={15} />}
          />
        ) : null}

        {props.columns.some((c) => c.sortable) ? (
          <div class="mobile-sort" role="group" aria-label="Sort table">
            <span>Sort:</span>
            {props.columns
              .filter((c) => c.sortable)
              .map((col) => {
                const isSorted = sortKey === col.key;
                return (
                  <button
                    key={col.key}
                    type="button"
                    class="mobile-sort-btn"
                    class:is-sorted={isSorted}
                    onClick={() => toggleSort(col.key)}
                  >
                    <span>{col.header}</span>
                    <Icon
                      icon={isSorted ? (sortDir === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown}
                      size={13}
                    />
                  </button>
                );
              })}
          </div>
        ) : null}

        <div class="table-shell">
          <table>
            <thead>
              <tr>
                {props.columns.map((col) => {
                  const isSorted = sortKey === col.key;
                  const ariaSort = isSorted
                    ? sortDir === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none';
                  return (
                    <th key={col.key} aria-sort={col.sortable ? ariaSort : undefined}>
                      {col.sortable ? (
                        <button type="button" class="sort-btn" onClick={() => toggleSort(col.key)}>
                          <span>{col.header}</span>
                          <Icon
                            icon={
                              isSorted ? (sortDir === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown
                            }
                            size={14}
                          />
                        </button>
                      ) : (
                        col.header
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colspan={props.columns.length} class="empty">
                    {props.emptyText ?? 'No matching rows.'}
                  </td>
                </tr>
              ) : (
                visible.map((row) => (
                  <tr key={props.rowKey(row)}>
                    {props.columns.map((col) => (
                      <td key={col.key} data-label={col.header}>
                        {col.render ? col.render(row) : String(row[col.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
