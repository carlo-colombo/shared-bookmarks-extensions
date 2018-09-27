const sharedFolderName = 'od-pks shared'

function init() {
  chrome.bookmarks.search({ title: sharedFolderName }, results => {
    if (results.length == 0)
      return console.log(`Please create a folder named ${sharedFolderName}`)
    if (results.length > 1)
      return console.log(
        `Multiple folder found, please just have one ${sharedFolderName}`
      )

    const [sharedFolder] = results

    chrome.bookmarks.removeTree(sharedFolder.id, () => {
      const { parentId, title, index } = sharedFolder,
        recreated = { parentId, title, index }

      fetch(
        'https://gist.githubusercontent.com/carlo-colombo/132c05e8c72d1f12cf0bfa678e8a11de/raw'
      )
        .then(r => r.json())
        .then(links =>
          chrome.bookmarks.create(recreated, node =>
            createLinks(node.id, links)
          )
        )
    })
  })
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

init()
