// export const baseUrl = "http://localhost:5000/api";
export const baseUrl = "candid-hummingbird-6eee9d.netlify.app/api";

// Function To Handle The Post Requests
export const postRequest = async (url: string, body: string) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  const data = await res.json();

  if (!res.ok) {
    let message;
    if (data?.message) {
      message = data.message;
    } else {
      message = data;
    }
    return { error: true, message };
  }

  return data;
};

// Function To Handle The Get Requests
export const getRequest = async (url: string) => {
  try {
    const res = await fetch(url);

    const data = await res.json();

    if (!res.ok) {
      let message = "An error occured.";
      if (data?.message) message = data.message;

      return { error: true, message };
    }

    return data;
  } catch (error) {
    return console.error("Error get request: ", error);
  }
};

// Function To Handle The Delete Requests
export const deleteRequest = async (url: string) => {
  const res = await fetch(url, {
    method: "Delete",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    let message;
    if (data?.message) {
      message = data.message;
    } else {
      message = data;
    }
    return { error: true, message };
  }

  return data;
};
