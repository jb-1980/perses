export const templates: { [key: string]: string } = {
  table: `header 1 | header 2 | header 3
    - | - | -
    data 1 | data 2 | data 3
    data 4 | data 5 | data 6
    data 7 | data 8 | data 9`,
  "titled table": `|| **Table title** ||
  header 1 | header 2 | header 3
  - | - | -
  data 1 | data 2 | data 3
  data 4 | data 5 | data 6
  data 7 | data 8 | data 9`,
  "aligned equations": `$\\begin{align} x+5 &= 30 \\
  x+5-5 &= 30-5 \\\\
  x &= 25 \\end{align}$`,
  "piecewise function": `$f(x) = \\begin{cases}
  7 & \\text{if }x=1 \\\\
  f(x-1)+5 & \\text{if }x > 1
  \\end{cases}$`,
}
