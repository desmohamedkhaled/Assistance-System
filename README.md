# نظام إدارة المساعدات (Assistance Management System)

نظام شامل لإدارة المساعدات والطلبات في مصر، مبني باستخدام React + TypeScript + Vite.

## 🚀 المميزات

- **واجهة مستخدم حديثة**: تصميم متجاوب وودود للمستخدم
- **إدارة شاملة**: إدارة المستخدمين، الطلبات، المساعدات، والفروع
- **تقارير تفصيلية**: رسوم بيانية وإحصائيات شاملة
- **تصدير البيانات**: إمكانية تصدير التقارير بصيغ مختلفة
- **نظام مصادقة آمن**: حماية البيانات والمعلومات الحساسة
- **دعم اللغة العربية**: واجهة باللغة العربية مع دعم RTL

## 🛠️ التقنيات المستخدمة

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: CSS Modules + Styled Components
- **Charts**: Chart.js + React-Chartjs-2
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns
- **Export**: jsPDF + jsPDF-AutoTable + XLSX

## 📋 المتطلبات

- Node.js 18+
- npm 9+

## 🚀 التثبيت والتشغيل

### 1. استنساخ المشروع
```bash
git clone https://github.com/desmohamedkhaled/Assistance-Management-System.git
cd Assistance-Management-System
```

### 2. تثبيت التبعيات
```bash
npm install
```

### 3. إعداد متغيرات البيئة
```bash
cp env.example env.local
# قم بتعديل ملف env.local حسب احتياجاتك
```

### 4. تشغيل المشروع في بيئة التطوير
```bash
npm run dev
```

### 5. بناء المشروع للإنتاج
```bash
npm run build
```

### 6. معاينة البناء
```bash
npm run preview
```

## 📁 هيكل المشروع

```
src/
├── components/          # المكونات القابلة لإعادة الاستخدام
│   ├── Charts/         # مكونات الرسوم البيانية
│   ├── Layout/         # مكونات التخطيط
│   └── UI/             # مكونات واجهة المستخدم
├── context/            # React Context للدولة العامة
├── data/               # البيانات الوهمية
├── pages/              # صفحات التطبيق
├── styles/             # ملفات التنسيق
├── types/              # تعريفات TypeScript
└── utils/              # وظائف مساعدة
```

## 🔧 الأوامر المتاحة

- `npm run dev` - تشغيل خادم التطوير
- `npm run build` - بناء المشروع للإنتاج
- `npm run preview` - معاينة البناء المحلي
- `npm run lint` - فحص جودة الكود

## 🌐 النشر

### Vercel (مستحسن)
```bash
# رفع المشروع إلى GitHub
git push origin main

# النشر التلقائي على Vercel
# سيتم النشر تلقائياً عند رفع التغييرات
```

### Docker
```bash
# بناء الصورة
docker build -t ams-app .

# تشغيل الحاوية
docker run -p 3000:3000 ams-app
```

### Docker Compose
```bash
# تشغيل جميع الخدمات
docker-compose up -d
```

## 📊 الصفحات المتاحة

- **لوحة التحكم**: نظرة عامة على الإحصائيات
- **المستخدمين**: إدارة المستخدمين والصلاحيات
- **الطلبات**: إدارة طلبات المساعدة
- **المساعدات**: إدارة أنواع المساعدات
- **المستفيدين**: إدارة بيانات المستفيدين
- **الفروع**: إدارة فروع المنظمة
- **المنظمات**: إدارة المنظمات الشريكة
- **المشاريع**: إدارة المشاريع
- **التقارير**: تقارير مفصلة وإحصائيات
- **الإعدادات**: إعدادات النظام

## 🔐 نظام المصادقة

- تسجيل الدخول الآمن
- إدارة الجلسات
- حماية الصفحات
- نظام الصلاحيات

## 📱 الاستجابة

التطبيق متجاوب ويعمل على جميع الأجهزة:
- أجهزة سطح المكتب
- الأجهزة اللوحية
- الهواتف الذكية

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى الفرع (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 التواصل

- **المطور**: محمد خالد
- **البريد الإلكتروني**: [your-email@example.com]
- **GitHub**: [@desmohamedkhaled](https://github.com/desmohamedkhaled)

## 🙏 شكر وتقدير

- فريق React للتقنية الرائعة
- مجتمع TypeScript للدعم المستمر
- جميع المساهمين في المشروع

---

**ملاحظة**: هذا المشروع مخصص للاستخدام في مصر ويتبع المعايير المحلية للعمل الخيري والمساعدات.