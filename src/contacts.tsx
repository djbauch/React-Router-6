import type { ContactRecord } from "./routes/Contact";
import localforage from "localforage"
import { matchSorter } from "match-sorter"
import _ from 'lodash'

export async function getContacts(query?: string) {
  await fakeNetwork(`getContacts:${query}`);
  let contacts: Array<ContactRecord>
    = await localforage.getItem("contacts") || []
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
  }
  return _.sortBy(contacts, ["last", "createdAt"])
}

export async function createContact() {
  await fakeNetwork();
  let id = Math.random().toString(36).substring(2, 9);
  let contact: Partial<ContactRecord> = { contactId: id, createdAt: Date.now() };
  let contacts: Partial<ContactRecord>[] = await getContacts();
  contacts.unshift(contact);
  await set(contacts);
  return contact;
}

export async function getContact(id:string) {
  await fakeNetwork(`contact:${id}`);
  let contacts = await localforage.getItem("contacts") as ContactRecord[];
  let contact = contacts.find(contact => contact.contactId === id);
  return contact ?? null;
}

export async function updateContact(id:string, updates: Partial<ContactRecord>) {
  await fakeNetwork();
  let contacts = await localforage.getItem("contacts") as ContactRecord[]
  let contact = contacts.find(contact => contact.contactId === id);
  if (!contact) throw new Error("No contact found for " + id);
  Object.assign(contact, updates);
  await set(contacts);
  return contact;
}

export async function deleteContact(id: string) {
  let contacts = await localforage.getItem("contacts") as ContactRecord[]
  let index = contacts.findIndex(contact => contact.contactId === id);
  if (index > -1) {
    contacts.splice(index, 1);
    await set(contacts);
    return true;
  }
  return false;
}

function set(contacts: Partial<ContactRecord>[]) {
  return localforage.setItem("contacts", contacts);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache: Record<string, boolean> = {};

async function fakeNetwork(key?: string) {
  if (!key) {
    fakeCache = {};
  }

  if (key && fakeCache[key]) {
    return
  }

  if (key) {
    fakeCache[key] = true;
  }
  return new Promise(res => {
    setTimeout(res, Math.random() * 800);
  });
}