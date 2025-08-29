// /* ================================
//    AUTH – Login / Register / Reset
//    MockAPI + EmailJS + Bootstrap
//    ================================= */

// import {
//   getUsers,
//   getUserByEmail,
//   getUserByUsername,
//   registerUser,
//   updateUser
// } from './services.js';

// document.addEventListener("DOMContentLoaded", () => {

//   /* ---------- CONFIG ---------- */
//   const CONFIG = {
//     appName: "M-Bites",
//     mockApiBase: "https://68b018353b8db1ae9c02b0d3.mockapi.io", // replace with your base
//     usersResource: "/users",
//     emailJs: {
//       serviceId: "service_62sact3",
//       templateId: "template_m88cai9",
//       publicKey: "tP6528kNbUhyao8d9"
//     },
//     login: {
//       maxAttempts: 5,
//       rememberMeDays: 14
//     }
//   };

//   const API_URL = CONFIG.mockApiBase + CONFIG.usersResource;

//   /* ---------- ELEMENTS ---------- */
//   const loginForm    = document.querySelector(".login-form");
//   const registerForm = document.querySelector(".register-form");
//   const resetForm    = document.querySelector(".reset-form");

//   const loginBtn          = document.querySelector("#login-btn");
//   const registerBtn       = document.querySelector("#register-btn");
//   const resetBtn          = document.querySelector("#reset-btn");
//   const loginFromRegister = document.getElementById("login-from-register");
//   const loginFromReset    = document.getElementById("login-from-reset");

//   const $ = (sel) => document.querySelector(sel);

//   const loginIdentifierInput = $("#login-identifier");
//   const loginPasswordInput   = $("#login-password");
//   const loginRememberInput   = $("#login-remember");

//   const resetIdentifierInput = $("#reset-input");
//   const resetPasswordInput   = $("#reset-password");

//   /* ---------- SPINNER ---------- */
//   const spinner = (() => {
//     const el = document.createElement("div");
//     el.id = "auth-spinner";
//     el.style.cssText = `position: fixed; inset: 0; display: none; align-items: center; justify-content: center; background: rgba(0,0,0,.25); z-index: 9999;`;
//     el.innerHTML = `<div class="spinner-border" role="status" aria-label="loading"></div>`;
//     document.body.appendChild(el);
//     return { show: () => el.style.display = "flex", hide: () => el.style.display = "none" };
//   })();

//   /* ---------- UTILITIES ---------- */
//   const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

//   function setInvalid(input, msg) {
//     if (!input) return;
//     input.classList.add("is-invalid");
//     input.classList.remove("is-valid");
//     const fb = input.closest(".form-group")?.querySelector(".invalid-feedback");
//     if (fb && msg) fb.textContent = msg;
//   }

//   function setValid(input) {
//     if (!input) return;
//     input.classList.remove("is-invalid");
//     input.classList.add("is-valid");
//   }

//   function clearValidation(formEl) {
//     formEl?.querySelectorAll(".is-valid,.is-invalid").forEach(i => i.classList.remove("is-valid","is-invalid"));
//   }

//   function showForm(formToShow) {
//     [loginForm, registerForm, resetForm].forEach(f => {
//       if (!f) return;
//       if (f === formToShow) f.classList.add("active");
//       else f.classList.remove("active");
//     });
//     clearValidation(loginForm);
//     clearValidation(registerForm);
//     clearValidation(resetForm);
//   }

//   function getSelectedRadioValue(radios) {
//     for (let r of radios) if (r.checked) return r.value;
//     return "";
//   }

//   function passwordScore(pw) {
//     let s=0; if (!pw) return s;
//     if (pw.length>=8) s++; if (pw.length>=12) s++;
//     if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
//     if (/\d/.test(pw)) s++;
//     if (/[^A-Za-z0-9]/.test(pw)) s++;
//     return Math.min(s,5);
//   }

//   /* ---------- PASSWORD TOGGLE ---------- */
//   document.querySelectorAll(".password-wrapper").forEach(wrapper=>{
//     const input=wrapper.querySelector("input[type='password'], input[type='text']");
//     const eyeSlash=wrapper.querySelector(".eye-slash");
//     const eyeOpen=wrapper.querySelector(".eye-open");
//     if (!input||!eyeSlash||!eyeOpen) return;
//     const toggle=()=>{ if(input.type==="password"){input.type="text"; eyeSlash.style.display="none"; eyeOpen.style.display="inline";} else {input.type="password"; eyeSlash.style.display="inline"; eyeOpen.style.display="none";} };
//     eyeSlash.addEventListener("click",toggle); eyeOpen.addEventListener("click",toggle);
//   });

//   /* ---------- FORM SWITCHING ---------- */
//   if(loginBtn) loginBtn.addEventListener("click",()=>showForm(loginForm));
//   if(registerBtn) registerBtn.addEventListener("click",()=>showForm(registerForm));
//   if(resetBtn) resetBtn.addEventListener("click",()=>showForm(resetForm));
//   if(loginFromRegister) loginFromRegister.addEventListener("click",()=>showForm(loginForm));
//   if(loginFromReset) loginFromReset.addEventListener("click",()=>showForm(loginForm));

//   showForm(loginForm);

//   /* ---------- AUTH BUTTON UPDATE ---------- */
//   function updateAuthButton() {
//     authButtonContainer.innerHTML = "";
//     const session = JSON.parse(localStorage.getItem("auth_session"));
//     if (session && session.user) {
//       const logoutBtn = document.createElement("button");
//       logoutBtn.className = "btn btn-accent";
//       logoutBtn.textContent = "Logout";
//       logoutBtn.addEventListener("click", () => {
//         if (confirm("Are you sure you want to log out?")) {
//           localStorage.removeItem("auth_session");
//           alert("You have been logged out.");
//           updateAuthButton();
//         }
//       });
//       authButtonContainer.appendChild(logoutBtn);
//     } else {
//       const loginLink = document.createElement("a");
//       loginLink.href = "auth.html";
//       loginLink.className = "btn btn-accent";
//       loginLink.textContent = "Login";
//       authButtonContainer.appendChild(loginLink);
//     }
//   }
//   updateAuthButton();

// document.addEventListener("DOMContentLoaded", () => {

//   const registerForm = document.getElementById("register-form");

//   const getSelectedRadioValue = (radios) => {
//     for (let r of radios) if (r.checked) return r.value;
//     return "";
//   };

//   // Simple email validation
//   const isEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   // Password strength check (optional)
//   const passwordScore = (pw) => {
//     let s = 0;
//     if (!pw) return s;
//     if (pw.length >= 8) s++;
//     if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
//     if (/\d/.test(pw)) s++;
//     if (/[^A-Za-z0-9]/.test(pw)) s++;
//     return Math.min(s, 5);
//   };

//   // Register form submit
//   registerForm?.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     // Grab all input values
//     const fullname = document.getElementById("register-name").value.trim();
//     const username = document.getElementById("register-username").value.trim();
//     const email = document.getElementById("register-email").value.trim();
//     const gender = getSelectedRadioValue(document.querySelectorAll('input[name="gender"]'));
//     const birthdate = document.getElementById("register-birthdate").value;
//     const phoneCode = document.querySelector(".register-phoneCode").value;
//     const phoneNumber = document.getElementById("register-phone").value.trim();
//     const password = document.getElementById("register-password").value;
//     const confirmPassword = document.getElementById("register-confirm-password").value;

//     // Simple validation
//     if (!fullname || !username || !email || !gender || !birthdate || !phoneCode || !phoneNumber || !password) {
//       alert("Please fill in all required fields.");
//       return;
//     }

//     if (!isEmail(email)) {
//       alert("Please enter a valid email.");
//       return;
//     }

//     if (password !== confirmPassword) {
//       alert("Passwords do not match.");
//       return;
//     }

//     if (passwordScore(password) < 3) {
//       alert("Password is too weak. Use at least 8 characters, mix letters and numbers.");
//       return;
//     }

//     // Build payload for MockAPI
//     const payload = {
//       fullname,
//       username,
//       email,
//       gender,
//       birthdate,
//       phoneCode,
//       phoneNumber,
//       password, // plain text for now
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     };

//     try {
//       // Call your existing registerUser function
//       await registerUser(payload);
//       alert("Registration successful!");
//       registerForm.reset();
//     } catch (err) {
//       console.error(err);
//       alert("Registration failed. Check console for details.");
//     }
//   });
// });


//   /* ======================
//      Login
//      ====================== */
//   loginForm?.addEventListener("submit", async e => {
//     e.preventDefault();
//     clearValidation(loginForm);

//     const identifier = loginIdentifierInput.value.trim();
//     const password = loginPasswordInput.value;

//     if (!identifier) { setInvalid(loginIdentifierInput,"Required"); return; } else setValid(loginIdentifierInput);
//     if (!password) { setInvalid(loginPasswordInput,"Required"); return; } else setValid(loginPasswordInput);

//     spinner.show();
//     try {
//       const users = await getUsers();
//       const user = users.find(u => (u.email===identifier || u.username===identifier) && u.password===password);
//       if (!user) { spinner.hide(); alert("Email/Username or password incorrect"); return; }

//       const remember = loginRememberInput?.checked;
//       localStorage.setItem("auth_session", JSON.stringify({ user, exp: remember?Date.now()+CONFIG.login.rememberMeDays*24*3600*1000:null }));
//       spinner.hide();
//       alert(`Welcome back, ${user.fullname}!`);
//       loginForm.reset();
//       // redirect to dashboard here

//     } catch(err) {
//       spinner.hide();
//       console.error(err);
//       alert("Login failed. Check console.");
//     }
//   });

//   /* ======================
//      Reset Password
//      ====================== */
//   resetForm?.addEventListener("submit", async e => {
//     e.preventDefault();
//     clearValidation(resetForm);

//     const identifier = resetIdentifierInput.value.trim();
//     const newPassword = resetPasswordInput.value;
//     if (!identifier) { setInvalid(resetIdentifierInput,"Required"); return; } else setValid(resetIdentifierInput);
//     if (passwordScore(newPassword)<3) { setInvalid(resetPasswordInput,"Password too weak"); return; } else setValid(resetPasswordInput);

//     spinner.show();
//     try {
//       const users = await getUsers();
//       const user = users.find(u => u.email===identifier || u.username===identifier);
//       if (!user) { spinner.hide(); alert("User not found"); return; }

//       await updateUser(user.id, { ...user, password: newPassword, updatedAt: new Date().toISOString() });
//       spinner.hide();
//       alert("Password reset successful! Please log in.");
//       resetForm.reset();
//       showForm(loginForm);

//     } catch(err) {
//       spinner.hide();
//       console.error(err);
//       alert("Password reset failed. Check console.");
//     }
//   });

// });

import emailjs from 'emailjs-com';

document.addEventListener('DOMContentLoaded', () => {
    const resetForm = document.getElementById('reset-form');
    const sendCodeBtn = document.getElementById('send-code-btn');
    const resetPasswordBtn = document.getElementById('reset-password-btn');

    const codeGroup = document.getElementById('code-group');
    const newPasswordGroup = document.getElementById('new-password-group');

    let generatedCode = '';
    let currentUserId = null; // store the user ID after verification

    // Initialize EmailJS
    emailjs.init("tP6528kNbUhyao8d9");

    // Step 1: Send verification code
    sendCodeBtn.addEventListener('click', async () => {
        const email = document.getElementById('reset-input').value.trim();
        if (!email) {
            alert('Please enter your email.');
            return;
        }

        try {
            alert("Checking if user exists...");
            const res = await fetch('https://68b018353b8db1ae9c02b0d3.mockapi.io/users');
            const users = await res.json();
            const user = users.find(u => u.email === email);

            if (!user) {
                alert('User not found!');
                return;
            }

            currentUserId = user.id;
            generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
            console.log("Generated code:", generatedCode);
            alert("Sending verification code to your email...");

            await emailjs.send("service_62sact3", "template_m88cai9", {
                to_email: email,
                reset_code: generatedCode
            });

            alert('Verification code sent successfully!');
            codeGroup.classList.remove('hidden');
            newPasswordGroup.classList.remove('hidden');
            resetPasswordBtn.classList.remove('hidden');
            sendCodeBtn.disabled = true;

        } catch (err) {
            console.error("Error sending email:", err);
            alert('Failed to send verification code. Check console for details.');
        }
    });

    // Step 2: Reset password
    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const enteredCode = document.getElementById('reset-code').value.trim();
        const newPassword = document.getElementById('reset-new-password').value.trim();

        if (!enteredCode || !newPassword) {
            alert('Please enter the verification code and a new password.');
            return;
        }

        if (enteredCode !== generatedCode) {
            alert('Incorrect verification code!');
            return;
        }

        try {
            alert("Updating password...");
            await fetch(`https://68b018353b8db1ae9c02b0d3.mockapi.io/users/${currentUserId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: newPassword })
            });

            alert('Password successfully reset!');
            resetForm.reset();
            codeGroup.classList.add('hidden');
            newPasswordGroup.classList.add('hidden');
            resetPasswordBtn.classList.add('hidden');
            sendCodeBtn.disabled = false;
            generatedCode = '';
            currentUserId = null;

        } catch (err) {
            console.error("Error resetting password:", err);
            alert('Failed to reset password. Check console for details.');
        }
    });
});

// Select the register form
const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('register-name').value;
    const username = document.getElementById('register-username').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const birthdate = document.getElementById('register-birthdate').value;
    const email = document.getElementById('register-email').value;
    const phoneCode = document.querySelector('.register-phoneCode').value;
    const phone = document.getElementById('register-phone').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    // Simple validation
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Build payload
    const payload = {
        name,
        username,
        gender,
        birthdate,
        email,
        phone: `${phoneCode}${phone}`,
        password
    };

    try {
        const response = await fetch('https://68b018353b8db1ae9c02b0d3.mockapi.io/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Failed to register');

        const data = await response.json();
        console.log('User registered:', data);
        alert('Account successfully created!');
        registerForm.reset(); // reset form
    } catch (error) {
        console.error(error);
        alert('Registration failed. Try again.');
    }

});





