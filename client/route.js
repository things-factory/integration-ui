export default function route(page) {
  switch (page) {
    case 'integration-setting':
      import('./pages/integration-setting')
      return page

    case 'connection':
      import('./pages/connection')
      return page

    case 'scenario':
      import('./pages/scenario')
      return page
  }
}
