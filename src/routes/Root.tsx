import { useEffect } from 'react'
import { Outlet, NavLink, useLoaderData, Form, redirect, useNavigation, useSubmit } from 'react-router-dom'
import { getContacts, createContact } from '../contacts'
import { ContactRecord } from './Contact'

export async function action() {
  const contact = await createContact()
  return redirect(`/contacts/${contact.contactId!}/edit`)
}

export async function loader({ request } : { request: {url: string}}) {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')
  const contacts = await getContacts(q || undefined);
  return { contacts, q };
}

export default function Root() {
  const { contacts, q } = useLoaderData() as {contacts: Array<Partial<ContactRecord>>, q: string}
  const navigation = useNavigation()
  const submit = useSubmit()

  const searching = navigation.location && new URLSearchParams(navigation.location.search).has('q')

  useEffect(() => {
    (document.getElementById('q') as HTMLInputElement).value = q
  }, [q])

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching ? "loading" : '' }
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              onChange={(event) => {
                const isFirstSearch = q == null
                submit(event.currentTarget.form, { replace: !isFirstSearch })}
              }
            />
            <div
              id="search-spinner"
              aria-hidden
              hidden={!searching}
            />
            <div
              className="sr-only"
              aria-live="polite"
            ></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.contactId}>

                  <NavLink to={`contacts/${contact.contactId}`}>
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>

                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div id="detail"
        className={navigation.state === 'loading' ? 'loading' : ''}>
        <Outlet />
      </div>
    </>
  );
}