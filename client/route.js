export default function route(page) {
  switch (page) {
    case 'connection':
      import('./pages/connection')
      return page

    case 'scenario':
      import('./pages/scenario')
      return page
  }
}
