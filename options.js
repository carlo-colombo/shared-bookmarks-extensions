const {h, app} = hyperapp,
	{section, div, input, form, button, label, hr} = hyperappHtml


const actions = {
	down: value => state => ({ count: state.count - value }),
	up: value => state => ({ count: state.count + value }),
	addItem: () => state => ({items: state.items.concat({url: "", folder: ""})})
}

const field = ({label: _label, value}) =>
	div({class: "field"}, [
		label({class: "label"}, _label),
		div({class: "control"}, [
			input({class: "input", name, type: "text", value})
		])
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
			state.items.map(item => [
				hr(),
				field({label: "Bookmark folder", name: "folder", value: item.folder}),
				field({label: "URL", name: "url", value: item.url})
			]),
		])
	])


chrome.storage.sync.get(null, state => app(state, actions, view, document.body))
