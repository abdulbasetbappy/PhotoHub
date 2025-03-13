# 📸 Image Management App

An efficient **image storage and management** application built with **Cloudinary** for image hosting, **Supabase** for authentication, and **TailwindCSS** for styling. This app is designed to help **data entry teams of WeTechPro** store, categorize, and reuse images effortlessly.

🚀 **Live Demo**: [Photo Hub](https://photo-hub-one.vercel.app/)  

## 🚀 Features

- **Authentication** 🔑: Secure login with Supabase.
- **Image Storage & Retrieval** 🖼️: Store images in Cloudinary with category-based organization.
- **Category Management** 📂: Create and manage categories dynamically.
- **Admin Panel** 🛠️: Upload, delete, and organize images easily.
- **Download & View Images** 👀: Preview and download images directly.
- **Protected Routes** 🔒: Secure access to critical admin features.

## 🛠️ Built With

- **Nuxt.js** – Vue-powered frontend framework
- **Supabase** – Authentication & database
- **Cloudinary** – Image hosting & management
- **TailwindCSS** – Modern UI styling

## 📂 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/route` | `GET` | Fetch all images categorized by folders |
| `/category/:categoryName` | `GET` | Fetch images from a specific category |
| `/auth` | `POST` | Authenticate and log in to the admin panel |
| `/upload` | `POST` | Upload an image with a category name (Protected) |
| `/deletion` | `DELETE` | Delete images or folders (Protected) |

## 🔐 Protected Routes

- `/upload` – Only authenticated users can upload images.
- `/deletion` – Only admins can delete images and folders.

## 🎨 UI Components

- **Image Card**: Displays images with details, **view**, and **download** buttons.
- **Admin Panel**: Manage categories, upload new images, and delete existing images.

## 📌 How to Use

1. **Log in** via `/auth` to access the admin panel.
2. **Upload images** under different categories.
3. **View and download images** from the gallery.
4. **Delete images and folders** via the deletion panel.

## 📦 Installation

1. Clone the repository:
   ```bash
        git clone https://github.com/yourusername/your-repo.git
        cd your-repo
    ```
2. Install dependencies:
    ```bash
        npm install
    ```
3. Set up environment variables (.env):
    ```bash
        CLOUDINARY_CLOUD_NAME=your-cloud-name
        CLOUDINARY_API_KEY=your-api-key
        CLOUDINARY_API_SECRET=your-api-secret

        SUPABASE_URL=your-supabase-url
        SUPABASE_ANON_KEY=your-supabase-key
    ```
4. Run the development server:
    ```bash
        npm run dev
    ```
## 📄 License
This project is open-source and available under the **MIT License**.


---

### 🔹 **Customizations You Can Add:**
- Replace `yourusername/your-repo` with your GitHub repository link.
- Add **screenshots** of the app for better documentation.
- Include **a demo link** if you have deployed the app.

Let me know if you need modifications! 🚀💡


