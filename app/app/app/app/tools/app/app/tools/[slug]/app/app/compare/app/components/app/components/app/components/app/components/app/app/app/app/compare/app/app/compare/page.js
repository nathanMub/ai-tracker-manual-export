                {rows.map((r, idx) => (
                  <Fragment key={`row-${idx}`}>
                    <div className=\"px-3 py-4 text-sm font-medium text-muted-foreground border-t border-border/40\">{r.label}</div>
                    {tools.map((t) => (
                      <div key={`${r.label}-${t.slug}`} className=\"px-4 py-4 text-sm border-t border-border/40\">{r.get(t)}</div>
                    ))}
                    {tools.length < 4 && <div className=\"border-t border-border/40\" />}
                  </Fragment>
                ))}
