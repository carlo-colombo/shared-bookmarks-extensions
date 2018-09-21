const {h, app} = hyperapp,
	{p, section, div, input, form, button, label, hr} = hyperappHtml

function search(item){
	return new Promise(resolve => chrome.bookmarks.search({title: item.folder}, resolve))
		.then(result => ({...item, validFolder: result.length == 1}))
}

const actions = {
	addItem: () => state => ({items: state.items.concat({url: "", folder: ""})}),
	save: () => async (state, actions) => {
		const items = await Promise.all(state.items.map(search))
		actions.updateItems(items)
	},
	updateItems: items => ({items}),
	updateField: ({ index, field, value }) => state => ({
		items: state.items.map((item, i) => (index == i ? {
			...item,
			[field]: value
		} : item))
	})
}

const Field = ({label: _label, value, update, name}) =>
	div({class: "field"}, [
		label({class: "label"}, _label),
		div({class: "control"}, [
			input({class: "input", name, type: "text", value,
				onchange: e => update({field: name, value: e.target.value}),
				onkeyup:  e => update({field: name, value: e.target.value}),
			})
		])
	])

const Item = ({folder, url, validFolder, index, updateField})  => ([
	hr(),
	p(validFolder? "valid" : "invalid"),
	Field({label: "Bookmark folder", name: "folder", value: folder, update: ({field, value}) => updateField({index, field, value})}),
	Field({label: "URL", name: "url", value: url, update: ({field, value}) => updateField({index, field, value})})
])

const control = ({ label, action }) =>
	div({class: "control"},[
		button({class: "button is-link", type: "submit", onclick: action }, label)
	])

const view = (state, actions) =>
	section({class: "section"}, [
		div({class: "container"}, [
			div({class: "field is-grouped"}, [
				control({label: "Save", action: actions.save}),
				control({label: "Add Item", action: actions.addItem})
			]),
			state.items.map((item,i) => Item({...item, updateField: actions.updateField, index: i})),
		])
	])


chrome.storage.sync.get(null, state => app(state.items ? state : {items: []}, actions, view, document.body))
