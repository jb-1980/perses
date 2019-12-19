import React from "react"

import { Categorizer } from "./categorizer-renderer"
import { TextListEditor } from "../UI/text-list-editor"
import { css } from "emotion"

const serialize = props => ({})

const CategorizerEditor = ({
  initialItems = [""],
  initialCategories = [""],
  initialValues = [],
  initialRandomizeItems = false,
}) => {
  const [randomizeItems, setRandomizeItems] = React.useState(
    initialRandomizeItems
  )
  const [categories, setCategories] = React.useState(initialCategories)
  const [items, setItems] = React.useState(initialItems)
  const [values, setValues] = React.useState(initialValues)

  console.log({ values })
  return (
    <div>
      <div
        className={css`
          margin: 5px 0;
        `}
      >
        <label>
          <input
            type="checkbox"
            checked={randomizeItems}
            onChange={() => setRandomizeItems(!randomizeItems)}
          />
          Randomize Item order
        </label>
      </div>
      Categories:
      <TextListEditor
        list={categories}
        setList={setCategories}
        layout="horizontal"
      />
      Items:
      <TextListEditor list={items} setList={setItems} layout="vertical" />
      <Categorizer
        categories={categories.slice(0, -1)}
        items={items.slice(0, -1)}
        values={values}
        setValues={setValues}
        validator={props => console.log(props)}
      />
    </div>
  )
}

export default {
  name: "Categorizer",
  editor: CategorizerEditor,
}
