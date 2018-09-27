;(function() {
  async function updateLinks() {
    const state = await new Promise(res => chrome.storage.sync.get(null, res))

    for (let item of state.items.filter(i => i.validFolder)) {
      const results = await new Promise(res =>
        chrome.bookmarks.search({ title: item.folder }, res)
      )

      const [{ parentId, title, index, id }] = results
      await new Promise(res => chrome.bookmarks.removeTree(id, res))

      const links = await fetch(item.url).then(r => r.json())

      chrome.bookmarks.create({ parentId, title, index }, node =>
        createLinks(node.id, links)
      )
    }
  }

  function createLinks(parentId, links) {
    links.forEach(link => {
      console.log(link.title)
      if (link.url) {
        chrome.bookmarks.create({ parentId, ...link })
      }
      if (link.children) {
        chrome.bookmarks.create({ parentId, title: link.title }, subroot =>
          createLinks(subroot.id, link.children)
        )
      }
    })
  }

  window.sbe = {
    updateLinks
  }
})(window)
