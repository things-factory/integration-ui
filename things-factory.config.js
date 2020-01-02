import route from './client/route'
import bootstrap from './client/bootstrap'

export default {
  route,
  routes: [
    {
      tagname: 'connection-page',
      page: 'connection'
    },
    {
      tagname: 'scenario-page',
      page: 'scenario'
    }
  ],
  bootstrap
}
