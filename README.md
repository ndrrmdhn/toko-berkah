# 🛒 Toko Berkah - Frontend CMS & CRUD System

Sistem marketplace frontend berbasis **HTML, CSS, JavaScript (Vanilla JS)** dengan dukungan:

* CRUD Produk
* CRUD Kontrakan
* CMS Website (Navbar, Hero, Footer, Section)
* Persistent storage menggunakan `localStorage`
* Admin dashboard modular

---

## 🚀 Overview

Project ini adalah aplikasi frontend yang mensimulasikan sistem backend menggunakan:

* AppState (runtime state)
* localStorage (persistence layer)
* Service Layer (Product, Rental, CMS)

Semua data akan tetap tersimpan meskipun halaman di-refresh atau browser ditutup.

---

## ✨ Features

### 🛍 Produk

* Create, Read, Update, Delete (CRUD)
* Toggle visibility produk
* Image preview realtime
* Search & filter
* Stock & kategori management

### 🏠 Kontrakan

* CRUD kontrakan
* Lokasi, harga, ukuran, deskripsi
* Toggle visibility
* Search & sorting
* Image support

### 🧠 CMS Website

Admin dapat mengatur:

* Nama website
* Logo
* Navbar menu
* Hero section (judul, subtitle, CTA)
* Footer
* Section title homepage

Semua perubahan CMS langsung mempengaruhi halaman frontend.

---

## 🧱 Architecture

```
AppState (Runtime)
   ↓
Service Layer
(ProductService / RentalService / CmsService)
   ↓
Storage Layer
(localStorage)
   ↓
UI Rendering Layer
(index.html / katalog.html / kontrakan.html / admin.html)
```

---

## 📁 Project Structure

```
assets/
 ├── js/
 │   ├── core/
 │   │   ├── storage.js
 │   │   ├── helpers.js
 │   │   └── state.js
 │   │
 │   ├── services/
 │   │   ├── product.service.js
 │   │   ├── rental.service.js
 │   │   └── cms.service.js
 │   │
 │   ├── ui/
 │   │   ├── modal.js
 │   │   └── toast.js
 │   │
 │   ├── pages/
 │   │   ├── admin.js
 │   │   ├── admin-rentals.js
 │   │   ├── admin-cms.js
 │   │   ├── home.js
 │   │   ├── catalog.js
 │   │   └── kontrakan.js
 │   │
 │   └── app.js
```

---

## ⚙️ Installation & Usage

1. Clone project

```bash
git clone https://github.com/username/toko-berkah.git
```

2. Buka project

```bash
cd toko-berkah
```

3. Jalankan dengan Live Server (VS Code)

* Install extension **Live Server**
* Klik "Go Live"

---

## 🔐 Admin System

Masuk ke:

```
admin.html
```

### Menu Admin:

* 📦 Produk Management
* 🏠 Kontrakan Management
* 🧠 CMS Website Management

---

## 💾 Data Storage (localStorage)

Data disimpan dengan key:

```js
products
rentals
cms
currentUser
```

Semua perubahan otomatis tersimpan tanpa backend.

---

## 🔄 Data Flow

1. Admin melakukan CRUD
2. Service Layer memproses data
3. AppState diperbarui
4. localStorage disimpan
5. Frontend otomatis render ulang

---

## 📱 Frontend Pages

### 🏠 index.html

* Hero section dari CMS
* Produk unggulan (6 item)
* Kontrakan unggulan (6 item)
* Navbar & footer dinamis

### 🛍 katalog.html

* Semua produk
* Search, filter, sort
* Responsive grid

### 🏡 kontrakan.html

* Listing semua kontrakan
* Filter lokasi & harga
* Dynamic rendering

---

## 🧠 Key Improvements (Refactor)

* Fix script loading order dependency
* Fix missing file references
* Fix duplicate event listeners
* Fix DOM selector mismatch
* Add RentalService + CMS system
* Normalize AppState structure
* Cross-page localStorage sync
* Modular architecture implementation
* Clean separation of concerns
* Zero console errors

---

## 🧪 Best Practices Used

* Modular JavaScript
* Service Layer Architecture
* Separation of Concerns
* Defensive Programming
* Persistent State Management
* Responsive UI Design
* Reusable Components
* Clean Folder Structure

---

## 🚀 Future Improvements

* Migrasi ke Laravel / REST API
* Authentication system real backend
* Database (MySQL/PostgreSQL)
* Image upload server (bukan URL)
* Pagination & lazy loading
* Unit testing service layer
* State management framework (Redux-like)

---

## 📌 Status

```
✔ Production Ready (Frontend Only)
✔ No Console Errors
✔ Fully Modular
```
