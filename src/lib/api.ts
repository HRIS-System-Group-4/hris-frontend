const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}`

export async function loginAdmin(login: string, password: string) {

  const csrfToken = document.cookie.split(';')
  .find(cookie => cookie.trim().startsWith('XSRF-TOKEN='))
  ?.split('=')[1];

    const { data } = await api.post("/api/admin/login", {
      login,
      password,
    });

    return data; // { token, user, ... }
  } catch (err) {
    // AxiosError memiliki response: { data, status, … }
    if (axios.isAxiosError(err)) {
      const message = err.response?.data?.message || "Failed to login";
      throw new Error(message);
    }
    throw err;
  }
}

// ------------------------------------------------------------
// EMPLOYEE LOGIN
// ------------------------------------------------------------
export async function loginEmployee(
  company: string,
  employee_id: string,
  password: string
) {
  try {
    await getCsrfCookie();

    const { data } = await api.post("/api/employee/login", {
      company,
      employee_id,
      password,
    });

    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const message = err.response?.data?.message || "Failed to login";
      throw new Error(message);
    }
    throw err;
  }
}

// ------------------------------------------------------------
// ADMIN REGISTER
// ------------------------------------------------------------
interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export async function registerUser({
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
}: RegisterData) {
  try {
    await getCsrfCookie();

    const { data } = await api.post("/api/admin/register", {
      name: `${firstName} ${lastName}`,
      email,
      password,
      password_confirmation: confirmPassword,
    });

    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const message = err.response?.data?.message || "Failed to register";
      throw new Error(message);
    }
    throw err;
  }
}

// ------------------------------------------------------------
// ADMIN REGISTER
// ------------------------------------------------------------
// export async function activateSubscription(plan: string) {
//   try {
//     await getCsrfCookie(); 

//     const { data } = await api.post("/api/subscription/activate", {
//       plan,
//     });

//     return data; 
//   } catch (err) {
//     if (axios.isAxiosError(err)) {
//       const message = err.response?.data?.message || "Gagal aktivasi subscription";
//       throw new Error(message);
//     }
//     throw err;
//   }
// }
export async function activateSubscription(payload: {
    plan: string;
    additional_employees: number;
  }) {
  const token = localStorage.getItem("authToken")
  const response = await fetch("http://localhost:8000/api/subscription/activate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}` // Ganti dengan token yang sesuai
    },
    body: JSON.stringify({
      plan: payload.plan, // atau plan ID
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }

  return await response.json();
}


// ------------------------------------------------------------
// OPTIONAL: interceptor global untuk log error (bisa di‐hapus)
// ------------------------------------------------------------
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error("API Error:", error);
//     return Promise.reject(error);
//   }
// );
