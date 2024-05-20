class Api {
  private url: string;
  private key: string;

  constructor(props: { key: string; url: string }) {
    const { key, url } = props;
    this.key = key;
    this.url = url || '';
  }

  private headers(key: string) {
    return {
      "Content-Type": "application/json",
      "x-api-key": key,
    };
  }

  post = async (path: string, body: string) => {
    return await fetch(this.url + path, {
      redirect: "follow",
      headers: this.headers(this.key),
      method: "POST",
      body,
    });
  };

  get = async (path: string) => {
    return await fetch(this.url + path, {
      redirect: "follow",
      headers: this.headers(this.key),
      method: "GET",
    });
  };

  put = async (path: string, body: string) => {
    return await fetch(this.url + path, {
      redirect: "follow",
      headers: this.headers(this.key),
      method: "PUT",
      body,
    });
  };

  delete = async (path: string) => {
    return await fetch(this.url + path, {
      redirect: "follow",
      headers: this.headers(this.key),
      method: "DELETE",
    });
  };
}

export default Api;
