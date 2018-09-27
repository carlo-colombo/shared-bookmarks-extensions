const { h, app } = hyperapp,
  { p, section, div, input, form, button, label, hr } = hyperappHtml

function search(item) {
  return new Promise(resolve =>
    chrome.bookmarks.search({ title: item.folder }, resolve)
  ).then(result => ({ ...item, validFolder: result.length == 1 }))
}

const actions = {
  addItem: () => state => ({
    items: state.items.concat({ url: '', folder: '' })
  }),
  save: () => async (state, actions) => {
    const items = await Promise.all(state.items.map(search))
    chrome.storage.sync.set({ items }, () => actions.updateItems(items))
  },
  updateItems: items => ({ items }),
  remove: index => state => ({
    items: state.items.filter((_, i) => index != i)
  }),
  updateField: ({ index, field, value }) => state => ({
    items: state.items.map(
      (item, i) =>
        index == i
          ? {
              ...item,
              [field]: value
            }
          : item
    )
  })
}

const Field = ({ label: _label, value, update, name, valid }) => {
  const updateFn = e => update({ field: name, value: e.target.value })

  return div({ class: 'field' }, [
    label({ class: 'label' }, _label),
    div({ class: 'control' }, [
      input({
        class: `input ${!valid && 'is-danger'}`,
        name,
        type: 'text',
        value,
        onchange: updateFn,
        onkeyup: updateFn
      })
    ])
  ])
}

const Item = ({ folder, url, validFolder, index, updateField, remove }) => {
  const update = ({ field, value }) => updateField({ index, field, value })
  return [
    hr(),
    Field({
      label: 'Bookmark folder',
      name: 'folder',
      value: folder,
      update,
      valid: validFolder
    }),
    Field({ label: 'URL asd ', name: 'url', value: url, update, valid: true }),
    button(
      { class: 'button is-danger', onclick: () => remove(index) },
      'Remove'
    )
  ]
}

const Control = ({ label, action }) => (
  <div class="control">
    <button class="button is-link" type="submit" onclick={action}>
      {label}
    </button>
  </div>
)

const view = (state, actions) =>
  section({ class: 'section' }, [
    div({ class: 'container' }, [
      div({ class: 'field is-grouped' }, [
        Control({ label: 'Save', action: actions.save }),
        Control({ label: 'Add Item', action: actions.addItem })
      ]),
      state.items.map((item, i) =>
        Item({
          ...item,
          updateField: actions.updateField,
          remove: actions.remove,
          index: i
        })
      )
    ])
  ])

chrome.storage.sync.get(null, state =>
  app(state.items ? state : { items: [] }, actions, view, document.body)
)
