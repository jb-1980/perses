import React from "react"
import { css } from "emotion"

import { Categorizer } from "./categorizer-renderer"
import { TextListEditor } from "../UI/text-list-editor"
import { useEditorContext } from "../contexts/editor-context"

const CategorizerEditor = ({
  id,
  items = [""],
  categories = [""],
  values = [],
  randomizeItems = false,
}) => {
  const { setWidgetProps } = useEditorContext()

  const currentProps = { items, categories, values, randomizeItems }

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
            onChange={() =>
              setWidgetProps(id, {
                ...currentProps,
                randomizeItems: !randomizeItems,
              })
            }
          />
          Randomize Item order
        </label>
      </div>
      Categories:
      <TextListEditor
        list={categories}
        setList={newCategories =>
          setWidgetProps(id, { ...currentProps, categories: newCategories })
        }
        layout="horizontal"
      />
      Items:
      <TextListEditor
        list={items}
        setList={newItems => {
          setWidgetProps(id, { ...currentProps, items: newItems })
        }}
        layout="vertical"
      />
      <Categorizer
        categories={categories.slice(0, -1)}
        items={items.slice(0, -1)}
        values={values}
        getNewProps={newProps => setWidgetProps(id, newProps)}
      />
    </div>
  )
}

export default {
  displayName: "Categorizer",
  type: "categorizer",
  editor: CategorizerEditor,
  graded: true,
  transform: props => ({
    randomizeItems: props ? props.randomizeItems : false,
    values: props ? props.values : [],
    items: props ? props.items.filter(i => i !== "") : [],
    categories: props ? props.categories.filter(i => i !== "") : [],
  }),
}
