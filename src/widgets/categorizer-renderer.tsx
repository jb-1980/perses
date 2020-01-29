import React from "react"
import { css } from "emotion"

type propTypes = {
  categories: string[]
  items: string[]
  values: number[]
  getNewProps: (newProps: {}) => void
}

export const Categorizer = ({
  categories = [],
  items = [],
  values = [],
  getNewProps,
}: propTypes) => {
  const validate = (categoryId: number, itemId: number) => {
    const newValues = [...values]
    newValues[itemId] = categoryId
    getNewProps({ categories, items, values: newValues })
  }
  return (
    <table
      className={css`
        border-collapse: collapse;
        & > td {
          padding: 5px;
          text-align: center;
        }
      `}
    >
      <thead>
        <tr>
          <th>&nbsp;</th>
          {categories.map((category, i) => (
            <th
              key={i}
              className={css`
                padding: 5px;
                text-align: center;
              `}
            >
              {category}
            </th>
          ))}
        </tr>
      </thead>
      <tbody
        className={css`
          & tr:nth-child(odd) td,
          tr:nth-child(odd) th {
            background-color: #ededed;
          }
        `}
      >
        {items.map((item, i) => (
          <tr key={i}>
            <th
              className={css`
                padding: 5px;
                text-align: center;
              `}
            >
              {item}
            </th>
            {categories.map((_, c) => {
              const isSelected = values[i] === c

              return (
                <td key={`${c}:${i}`} onClick={() => validate(c, i)}>
                  <div
                    className={css`
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    `}
                  >
                    <div
                      className={css`
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        border: 3px solid;
                        box-sizing: border-box;
                        border-color: ${isSelected
                          ? "transparent"
                          : "var(--color-secondary)"};
                        background-color: ${isSelected
                          ? "var(--color-secondary)"
                          : "transparent"};
                        opacity: ${isSelected ? 1 : 0.6};
                        &:hover {
                          opacity: ${isSelected ? 0.6 : 1};
                        }
                      `}
                    />
                  </div>
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export const CategorizerRenderer = {
  type: "categorizer",
  displayName: "Categorizer",
  widget: Categorizer,
  grade: (props: propTypes, options: propTypes) => {
    const { values: correctValues } = options
    const { values: userValues } = props

    for (let i = 0; i < userValues.length; i += 1) {
      if (correctValues[i] !== userValues[i]) {
        return false
      }
    }

    return true
  },
  transform: (options: propTypes) => ({
    items: options.items,
    categories: options.categories,
  }),
}
