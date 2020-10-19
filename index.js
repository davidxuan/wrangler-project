const links = [
  {
    name: "Cloudflare",
    url: "https://www.cloudflare.com/",
  },
  {
    name: "Google",
    url: "https://www.google.com/",
  },
  {
    name: "Yahoo",
    url: "https://www.yahoo.com/",
  },
];

const headers = {
  headers: {
    "content-type": "application/json",
  },
};

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

function handleLinkReqeust(request) {
  const body = JSON.stringify(links);
  return new Response(body, headers);
}

function handleHTMLRequest(request, static_html) {
  return new Promise((resolve, reject) => {
    let rendered_html = new HTMLRewriter()
      .on("body", new BodyTransformer())
      .on("div#links", new LinksTransformer(links))
      .on("div#profile", new ProfileTransformer())
      .on("h1#name", new NameTransformer())
      .on("img#avatar", new AvatarTransformer())
      .on("div#social", new IconTransformer())
      .on("title", new TitleTransformer())
      .transform(static_html);
    resolve(rendered_html);
  });
}

async function handleRequest(request) {
  return new Promise((resolve, reject) => {
    let url = new URL(request.url);
    if (url.pathname === "/links") {
      resolve(handleLinkReqeust(request));
    } else {
      fetch("https://static-links-page.signalnerve.workers.dev").then(
        (response) => {
          resolve(handleHTMLRequest(request, response));
        }
      );
    }
  });
}

class BodyTransformer {
  async element(element) {
    element.setAttribute("style", "background-color: #2A4365");
  }
}

class ProfileTransformer {
  async element(element) {
    element.removeAttribute("style");
  }
}

class NameTransformer {
  async element(element) {
    element.setInnerContent("Zhichun Xuan");
  }
}

class LinksTransformer {
  constructor(links) {
    this.links = links;
  }
  async element(element) {
    this.links.forEach((link) => {
      element.append(`<a href="${link.url}" target="_blank">${link.name}</a>`, {
        html: true,
      });
    });
  }
}

class AvatarTransformer {
  async element(element) {
    element.setAttribute(
      "src",
      "https://i.pinimg.com/originals/d1/17/7c/d1177cb0eef60ee00ae2b6ddf1d42b25.jpg"
    );
  }
}

class IconTransformer {
  constructor() {
    this.links = [
      {
        name: "GitHub",
        url: "https://github.com/davidxuan",
        icon: "https://simpleicons.org/icons/github.svg",
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/zhichun-xuan/",
        icon: "https://simpleicons.org/icons/linkedin.svg",
      },
    ];
  }
  async element(element) {
    element.removeAttribute("style");
    this.links.forEach((social) => {
      element.append(
        `<a href="${social.url}" target="_blank"><img src="${social.icon}" alt="${social.name}"/></a>`,
        {
          html: true,
        }
      );
    });
  }
}

class TitleTransformer {
  async element(element) {
    element.setInnerContent("Zhichun Xuan");
  }
}
