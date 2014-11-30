## Lonely Hangouts

*Local testing for the Google+ Hangouts API<br>
By Dan Vanderkam*

Google+ Hangouts provide an API very reminiscent of the Google Wave Gadgets
API, which later became the Google Shared Spaces API. This API makes it easy to
create collaborative web apps without worrying about backend synchronization or
edit conflicts.

The API is great, but the iteration process (which requires pushing everything
to an external server or two) leaves something to be desired.

It's also difficult to test multiplayer scenarios because you need a separate
Google+ account and a separate computer for each player.

Lonely Hangouts solves both of these problems by letting you hang out all by
yourself (hence the name!). It provides a node.js server which emulates a
portion of the Google+ Hangouts API. It does not require accounts and loads all
resources from local disk.


#### Installation

Lonely Hangouts requires node.js.

Once you have node, run:

    npm install lonely


#### Usage

To use Lonely Hangouts, run:

    ./node_modules/.bin/lonely your_app.xml

Then connect to http://localhost:8080 in your browser. You can open the URL in
an incognito window or another browser to create a second user.

For a quick demo, you can try cloning this repo and running:

    ./lonely.js demos/basic.xml

If you change your XML file or any of the resources that it includes, you'll
need to refresh the page in your browser. This will not erase the existing app
state.

For extra-speedy testing, Lonely has a single player mode:

    ./node_modules/.bin/lonely.js --single your_app.xml

Now you can only create a single user, but there is no server-side state. This
lets you iterate on your layout and design just like you would in a normal web
page.


#### Rewrites

In a published Hangout App, resources must be hosted at a public https
location. But for local development, it's much more convenient to use local
versions of the resources.

To accomodate this, Lonely uses simple rewrites. Write out the full external
path in your XML file, then specify a rewrite which converts it to a local
path. When you run the App with Lonely, the rewrites will be used. When you
push the XML file to G+, the rewrites will be ignored.

Here's what a rewrite looks like (see also demos/basic.xml):

    <!-- lonely
    {
    rewrites: [
      {
        from: "https://raw.github.com/danvk/lonely/master/",
        to: ""
      }
    ]
    }
    -->

This is nothing more than a search/replace. It will change script sources,
image sources and JavaScript sources, but also links and URLs in plain text.

Paths are relative to the directory from which you started the server.


#### Remaining work

There are _many_ methods of the G+ Hangouts API which are not currently
implemented in Lonely Hangouts. For a complete API reference, see:
https://developers.google.com/+/hangouts/api/

Other useful features would include:

  - A "reset state" button
  - A facility for saving/restoring state
