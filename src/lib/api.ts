const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}`

export async function   loginAdmin(login: string, password: string) {

  const csrfToken = document.cookie.split(';')
  .find(cookie => cookie.trim().startsWith('XSRF-TOKEN='))
  ?.split('=')[1];

  const res = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "accept" : "application/json",
      // 'X-CSRF-TOKEN': csrfToken,
    },
    credentials: 'include',
    body: JSON.stringify({ login, password }),
  });
  
  const contentType = res.headers.get("Content-Type");
  
  if (!res.ok) {
    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();
      throw new Error(data.message || "Failed to login");
    } else {
      const text = await res.text();
      throw new Error(`Unexpected response: ${text}`);
    }
  }
  
  const data = await res.json();
  return data;  
}

export async function loginEmployee(company: string, employee_id: string, password: string) {
  const res = await fetch(`${API_URL}/employee/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ company, employee_id, password }),
  });

  if (!res.ok) throw new Error("Failed to login");
  return res.json();
}

export async function registerUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const res = await fetch(`${API_URL}/admin/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      password: data.password,
      password_confirmation: data.confirmPassword,
    }),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || "Failed to register");
  }

  return res.json();
}
