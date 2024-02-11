import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, LinksFunction } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import type { FunctionComponent } from "react";
import invariant from "tiny-invariant";
import type { ContactRecord } from "../data";
import { getContact, updateContact } from "../data";
import devStylesHref from "../dev.css";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ contact });
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: devStylesHref }];
};

const Favorite: FunctionComponent<{
  contact: Pick<ContactRecord, "favorite">;
}> = ({ contact }) => {
  const fetcher = useFetcher();
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : contact.favorite;

  return (
    <fetcher.Form method="post">
      <button
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
};

export default function Contact() {
  const { contact } = useLoaderData<typeof loader>();
  return (
    <div id="contact">
      <div>
        <h1>
          {contact.name ? <>{contact.name}</> : <i>No Name</i>}{" "}
          <Favorite contact={contact} />
        </h1>
        {contact.notes ? <p>{contact.notes}</p> : null}
      </div>
      <div id="loader">
        {/* loader追加 */}
        <div className="frame">
          <div className="loader1"></div>
        </div>
        <div className="frame">
          <div className="loader2"></div>
        </div>
        <div className="frame">
          <div className="loader3"></div>
        </div>
        <div className="frame">
          <div className="loader4"></div>
        </div>
        <div className="frame">
          <div className="loader5"></div>
        </div>
        <div className="frame">
          <div className="loader6"></div>
        </div>
        {/* loader終了 */}
      </div>
    </div>
  );
}
