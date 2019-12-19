import React from "react"
import { css } from "emotion"

export const TextListEditor = ({ list, setList, layout = "horizontal" }) => {
  const getTextWidth = (text: string) => `${text.length + 1}ch`

  const updateList = (e, i) => {
    const _list = [...list]
    _list[i] = e.target.value
    return setList(_list)
  }
  const nodes = list.reduce((nodes, element, i) => {
    if (i + 1 === list.length) {
      if (element !== "") {
        setList([...list, ""])
      }
    } else if (i !== 0 && element === "") {
      const _list = [...list]
      _list.splice(i, 1)
      setList(_list)
    }

    nodes.push(
      <li
        key={i}
        className={css`
          display: ${layout === "horizontal" ? "inline" : "inherit"};
          margin: ${layout === "horizontal" ? "0 2px" : "2px 0"};
        `}
      >
        <input
          type="text"
          value={element}
          onChange={e => updateList(e, i)}
          className={css`
            min-width: 20px;
          `}
          style={{ width: getTextWidth(element) }}
        />
      </li>
    )
    return nodes
  }, [])

  return (
    <ul
      className={css`
        list-style: none;
        padding: 0;
      `}
    >
      {nodes}
    </ul>
  )
}
