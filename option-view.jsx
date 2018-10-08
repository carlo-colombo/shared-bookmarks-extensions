;(function(window) {
  const { h, app } = hyperapp

  const Field = ({ label: _label, value, update, name, valid }) => {
    const updateFn = e => update({ field: name, value: e.target.value })

    return (
      <div class="field">
        <label class="label">{_label}</label>
        <div class="control">
          <input
            class={`input ${!valid && 'is-danger'}`}
            type="text"
            name={name}
            value={value}
            onchange={updateFn}
            onkeyup={updateFn}
          />
        </div>
      </div>
    )
  }

  const Item = ({ folder, url, validFolder, index, updateField, remove }) => {
    const update = ({ field, value }) => updateField({ index, field, value })
    return [
      <hr />,
      <Field
        label="Bookmark folder"
        name="folder"
        value={folder}
        update={update}
        valid={validFolder}
      />,
      <Field label="URL" name="url" value={url} update={update} valid={true} />,
      <button class="button is-danger" onclick={() => remove(index)}>
        Remove
      </button>
    ]
  }

  const Control = ({ label, action }) => (
    <div class="control">
      <button class="button is-link" type="submit" onclick={action}>
        {label}
      </button>
    </div>
  )

  window.sbe.optionsView = (state, actions) => {
    const items = state.items.map((item, index) => (
      <Item
        {...{ ...item, index }}
        updateField={actions.updateField}
        remove={actions.remove}
      />
    ))

    return (
      <section class="section">
        <div class="container">
          <div class="field is-grouped">
            <Control label="Save" action={actions.save} />
            <Control label="Add item" action={actions.addItem} />
          </div>
          {items}
        </div>
      </section>
    )
  }
})(window)
