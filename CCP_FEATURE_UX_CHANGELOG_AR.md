# سجل تغييرات التبسيط (Feature UX Changelog) — CCP Exam Coach v1.0.2

**من:** `CCP_Exam_Coach_v1.0.2_FINAL.html` (SHA-256: `9a3a0e006e7cc5ba2604eae86ee354f5ce43871fc7f14fa1df205c04afcf4e22`)
**إلى:** `CCP_Exam_Coach_v1.0.2_FINAL.html` (نفس الاسم، محتوى محدّث — SHA-256 الجديد: `1605651184138c5daff5d0459c4c9f8709204f9a3dbc0b7b3a814fc95907a06d`)
**نوع التغيير:** واجهة/عرض (Markup) فقط — لا تغيير في أي منطق أو بيانات
**مرجع التدقيق الكامل:** `CCP_FEATURE_SURFACE_AUDIT_AR.md`

---

## ما أصبح أقل ظهورًا (What became less visible)

1. **زر Formula Lab** كان يظهر مباشرة بجانب زر "Choose a Chapter →" الرئيسي في شاشة Study. أصبح الآن داخل قسم مطوي.
2. **بطاقة "Calculation practice"** الكاملة (Calculation Drill, Timed Calculation Set, Method Selection) كانت ظاهرة دائمًا كبطاقة مستقلة في شاشة Study. أصبحت الآن مطوية.
3. **بطاقة "How the real CCP exam is actually scored"** كانت تُعرض بالكامل دائمًا ضمن التدفق الرئيسي لشاشة Exam Practice. أصبحت الآن خلف عنصر قابل للطي بعنوان "Scoring details" — بنفس المحتوى تمامًا دون تغيير حرف واحد.
4. **بطاقة "Also here"** (التي كانت تجمع Memo Practice مع روابط تنقّل أخرى غير متجانسة) أُزيلت كتجميعة، وتوزّع محتواها بشكل أوضح (انظر أدناه).

## ما انتقل إلى قسم متقدّم/مطوي (What moved under advanced/collapsed sections)

| العنصر | كان في | أصبح في |
|---|---|---|
| Formula Lab | بجانب الزر الرئيسي في Study | داخل "Additional Practice" المطوية في Study |
| Calculation Drill | بطاقة "Calculation practice" الظاهرة | داخل "Additional Practice" المطوية |
| Timed Calculation Set | بطاقة "Calculation practice" الظاهرة | داخل "Additional Practice" المطوية |
| Method Selection | بطاقة "Calculation practice" الظاهرة | داخل "Additional Practice" المطوية |
| "How the real CCP exam is actually scored" | بطاقة ظاهرة دائمًا في Exam Practice | داخل "Scoring details" المطوية في Exam Practice |

**ملاحظة:** الأقسام التالية كانت **مطوية بالفعل وبشكل صحيح** قبل هذا التعديل، وتم التحقق من ذلك بلقطات شاشة حقيقية — **لم يتم تغييرها**: "More study options" (القسم القديم في Study، الآن مدمج ضمن "Additional Practice")، "Choose manually instead" في Fix Weak Areas، "Advanced options" في شاشة إعداد الجلسة، و"Mistakes & final review" / "Chapters — all attempts" / "Session history & pacing" / "Data & export" في Progress.

## ما بقي ظاهرًا مباشرة (What remained directly visible)

- شريط التنقّل الرئيسي: **Today, Study, Fix Weak Areas, Exam Practice, Progress, More** — بدون أي تغيير.
- شاشة **Today**: توصية "WHAT TO DO NEXT" الوحيدة + سلّم تقدّم الفصل — بدون أي تغيير.
- شاشة **Fix Weak Areas**: زر "Start Fix Weak Areas Session →" + "Open My Mistakes" — بدون أي تغيير.
- شاشة **Progress**: Training Readiness، Memo Readiness، قائمة الفصول الـ 34، Weak areas — بدون أي تغيير.
- شاشة **More**: كل عناصرها الثمانية — بدون أي تغيير.
- في **Exam Practice**: الصيغ الخمس نفسها (Timed Practice Mock, Unseen Chapter Test, Blueprint Practice Mock, Blueprint Transfer Check, Memo Practice, Full CCP Simulation) بقيت **جميعها ظاهرة مباشرة بدون نقرة إضافية** — تم فقط **تجميعها** بعناوين مرحلية واضحة (Practice/Pacing، Readiness/Transfer، Communication، Full Simulation) بدلاً من عرضها كقائمة مسطّحة، ونُقل Blueprint Transfer Check تحديدًا من مكان مطوٍ منعزل إلى الظهور المباشر ضمن مجموعته المنطقية.

## ما لم يتغيّر إطلاقًا (What was not changed)

بنك الأسئلة الـ 830 وجميع مفاتيحها ونصوصها ومفاتيح إجابتها وشروحاتها ومصادرها وصيغها الحسابية وبيانات blueprintTasks، خرائط V527/V528، منطق أدلة Blueprint (76 مهمة)، عتبات الإتقان، منطق Apply/Mastery/Challenge/Retention/SRS/High-Confidence Wrong/Fragile Knowledge/Unseen evidence، بوابات Official Study Guide، منطق المذكرة (Memo) ومنطق Memo Readiness، Training Readiness، منطق اختيار Blueprint Mock وحصصه (43/29/13/20/6/8)، محرك Full Simulation، منطق التصحيح، بنية الحفظ، سلوك Export/Import، ومخطط بيانات PROGRESS. **تم التحقق من كل ما سبق فعليًا عبر مقارنة مباشرة بين النسخة القديمة والجديدة (byte-for-byte حيث ينطبق ذلك)، وليس افتراضًا.**

## مدخل طالب واحد أُزيل (Removed student-facing entry point)

**لا يوجد.** لم تتم إزالة أي مدخل واجهة كان يعمل مسبقًا؛ كل تغيير هو نقل مكان/تجميع فقط. (بطاقة "Also here" أُزيلت كحاوية تجميع، لكن كل زر كان بداخلها ما زال متاحًا في مكانه الجديد الأوضح: Memo Practice ضمن مجموعة Communication الظاهرة، وFinal Week Review / See Full Progress كرابطين ثانويين ظاهرين أسفل الشاشة.)

## تأكيد بقاء المحرّك سليمًا (Engine remains available)

| الميزة | حالتها الآن |
|---|---|
| Formula Lab | تعمل بالضبط كما كانت، متاحة بنقرة واحدة إضافية فقط ("Additional Practice ▸") |
| Calculation Drill / Timed Calculation Set / Method Selection | نفس ما سبق |
| Random Practice / Generated Practice / Fresh Challenge (manual) | لم تتغير مطلقًا (كانت وما زالت مطوية في نفس المكان تقريبًا) |
| Blueprint Transfer Check (119Q) | تعمل بالضبط كما كانت؛ أصبحت الآن أسهل وصولًا (ظاهرة مباشرة بدل مطوية بمعزل) |
| "How the real CCP exam is actually scored" | نفس المحتوى بالضبط، متاح بنقرة واحدة إضافية فقط ("Scoring details ▸") |

---

## التقرير النهائي للفحص (Final regression report)

| الفحص | النتيجة |
|---|---|
| عدد الأسئلة وقت التشغيل | **830** |
| عدد المفاتيح الفريدة (Unique IDs) | **830** |
| تطابق بنك الأسئلة (byte-for-byte) مع النسخة السابقة | **مطابق تمامًا (Exact JSON string equality: true)** |
| 76/76 مهمة Blueprint قابلة للإتقان (mastery-reachable) | **76 / 76** |
| ≥1 دليل مباشر (direct evidence) لكل مهمة | **76 / 76 (0 دون الحد الأدنى)** |
| ≥3 أدلة مرتبطة (mapped evidence) لكل مهمة | **76 / 76 (0 دون الحد الأدنى)** |
| Blueprint Mock = 119 سؤال بالحصص الدقيقة 43/29/13/20/6/8 | **50/50 تشغيلة مطابقة تمامًا، 0 اختلاف** |
| صفر مفاتيح مكررة في اختبارات الضغط | **0 تكرار** عبر 50 تشغيلة Blueprint Mock + 30×2 تشغيلة عبر أوضاع أخرى |
| بوابة Official Study Guide | **بدون تغيير** (لم تُلمَس، والمسارات التي تعتمد عليها اجتازت التحقق) |
| منطق Apply/Mastery/Challenge/Retention | **مطابق تمامًا (byte-for-byte) للنسخة السابقة** عبر سيناريو كامل: Provisional → Retention Due → Retained |
| سلوك High-Confidence Wrong | **مطابق تمامًا (byte-for-byte)**: ظهور المفهوم الخاطئ ثم حله بسؤال مختلف لنفس المهارة |
| Memo Readiness | **مطابق تمامًا (byte-for-byte)**: الحالات الثلاث (Not Assessed / Competent / Needs Work) |
| Full Simulation | **مطابق تمامًا**: 119 سؤال، الحصص الست نفسها، المؤقّت الرئيسي، عدد قوالب المذكرة، بطاقة التصحيح الرسمي |
| Export / Import | **يعمل بشكل صحيح**: تصدير → إعادة ضبط → استيراد يعيد كل المحاولات؛ الفرق الوحيد (`everSeenIds`) هو نفس السلوك الآمن الموروث من الإصلاح السابق (يوسّع السجل ولا يُنقصه أبدًا)، وغير متعلق بهذا التعديل |
| أخطاء console/runtime جديدة | **صفر** عبر كل الفحوصات (المقياس الإجمالي، الرحلات العشر، فحوصات Blueprint، Full Simulation، Export/Import) |
| اختبار Regression الحالي (78 اختبارًا) | **78 / 78** |
| فحص integrityResults() المدمج | **58 / 58** |
| فحص الوصول لـ 34 فصلًا (recommended-path) | **0 / 34 عالق (0 stuck)** |

### الرحلات العشر الأساسية (Before/After Journeys) — جميعها ناجحة

1. متعلّم جديد: Today → Chapter → Practice — **نجاح**
2. تقدّم الفصل: Practice + Official Study Guide → Apply → Mastery → Challenge — **نجاح**
3. Provisional Mastery: الاستمرار للفصل التالي أثناء انتظار Retention — **نجاح**
4. Retention Due: Today → Retention Test — **نجاح**
5. فشل Retention: Repair → إعادة اختبار Retention صالحة — **نجاح**
6. High-Confidence Wrong: ظهور الضعف وإمكانية إصلاحه — **نجاح**
7. Fix Weak Areas: جلسة تكيّفية بنقرة واحدة — **نجاح**
8. Exam Practice: Timed Practice Mock, Blueprint Mock, Unseen Chapter Test, Blueprint Transfer Check, Memo Practice, Full Simulation — **نجاح (كل الأزرار تعمل من التخطيط الجديد المُجمَّع)**
9. Progress: الجاهزية وحالة الفصول ظاهرة — **نجاح**
10. الأدوات المتقدمة/اليدوية: لا تزال قابلة للوصول عند الطلب المتعمّد (Formula Lab من "Additional Practice"، Chapter Evidence من More) — **نجاح**

**الخلاصة: تم تنفيذ التبسيط المطلوب حصريًا كتغييرات HTML/عرض ضمن دالتين (`renderPracticeCenter`, `renderExamCenter`) بالإضافة إلى قاعدتي CSS جديدتين لتنسيق العناوين المرحلية. لا تغيير في أي محتوى أو منطق أو تسجيل بيانات. جميع الفحوصات المطلوبة اجتازت بنجاح كامل.**
