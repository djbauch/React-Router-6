import * as React from 'react'
import ReactDOM from 'react-dom/client'
import Root, { loader as rootLoader, action as rootAction } from './routes/Root'
import ErrorPage from './error-page'

import Contact, {
  loader as contactLoader,
  action as contactAction
} from './routes/Contact'

import EditContact, {
  action as editContactAction
} from './routes/Edit'

import { action as destroyAction } from './routes/Destroy'

import Icon, {
  loader as iconLoader,
} from './routes/Icon'

import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from 'react-router-dom'

import Index from './routes/Index'

import "./index.css"

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<Root />} errorElement={<ErrorPage />} loader={rootLoader} action={rootAction} >
      <Route errorElement={<ErrorPage />} />
      <Route index={true} element={<Index />} />
      <Route path="/contacts/:contactId" element={<Contact />} loader={contactLoader} action={contactAction} />
      <Route path="/contacts/:contactId/edit" element={<EditContact />} loader={contactLoader} action={editContactAction} />
      <Route path="contacts/:contactId/destroy" action={destroyAction}
        errorElement={<div>Oops! Something terrifying happened during destruction</div>} />
      <Route path="/icons/:iconId" element={<Icon />} loader={iconLoader} />
    </Route>
  ])
)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
