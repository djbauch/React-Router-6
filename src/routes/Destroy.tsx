import { redirect } from 'react-router-dom'
import { deleteContact } from '../contacts'
import { ContactRecord } from './Contact'

export async function action({params}: {params: Partial<ContactRecord>}) {
  await deleteContact(params.contactId!)
  return redirect('/')
}
