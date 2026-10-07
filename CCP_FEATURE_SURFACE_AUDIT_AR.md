# تدقيق سطح الميزات (Feature Surface Audit) — CCP Exam Coach v1.0.2

**الملف المرجعي (Source of Truth):** `CCP_Exam_Coach_v1.0.2_FINAL.html` (الكود الفعلي الحي، وليس الأدلة بالعربية)
**نوع المهمة:** تبسيط واجهة الطالب (Student-UX / Feature-Surface Simplification) — بدون حذف أي قدرة (capability)
**تم إعداد هذا التدقيق قبل إجراء أي تعديل على الكود**، كما هو مطلوب.

---

## ملخص تنفيذي

بعد فحص الكود الحي فعليًا (وليس الاعتماد على الأدلة العربية فقط) وتشغيل التطبيق وأخذ لقطات شاشة حقيقية (screenshots) لكل شاشة رئيسية، تبيّن أن التطبيق **قد خضع بالفعل لعملية تبسيط سابقة ناجحة إلى حد كبير**:

- التنقّل الرئيسي (Main Navigation) يطابق تمامًا البنية المطلوبة بالفعل: **Today → Study → Fix Weak Areas → Exam Practice → Progress**، مع **More** كمدخل ثانوي — لا حاجة لأي تغيير هنا.
- شاشة **Today** هي بالفعل "الموجّه" (orchestrator) المطلوب: توصية واحدة واضحة ("WHAT TO DO NEXT") مع زر إجراء رئيسي واحد فقط، بدون خيارات متنافسة.
- آلية الطي (`<details>` / "▸ اضغط للمزيد") تعمل فعليًا وبشكل صحيح في **Fix Weak Areas** و **Progress** و **شاشة إعداد الجلسة (Session Setup)** — تم التحقق من ذلك بلقطات شاشة حقيقية، وليس فقط بفحص الكود.
- الأنظمة الذكية في الخلفية (Mastery، Retention، SRS، High-Confidence Wrong، Fragile Knowledge، Blueprint Task evidence، Seen Ledger، Quality Gate) **لا تملك أي واجهة إدارة مباشرة للطالب أصلاً** — تظهر فقط كنتائج (مثل: "1 unresolved misconception")، وهذا مطابق تمامًا للمطلوب في الخطوة 9 بدون أي تعديل.

الفجوتان الحقيقيتان الوحيدتان اللتان تم تأكيدهما فعليًا (وليس افتراضيًا) هما:

1. **شاشة Study**: زر "Formula Lab" وبطاقة "Calculation practice" (بأزرارها الثلاثة: Calculation Drill, Timed Calculation Set, Method Selection) تظهر **دائمًا وبشكل كامل** بجانب الإجراء الرئيسي "Choose a Chapter"، بدلاً من أن تكون مطوية.
2. **شاشة Exam Practice**: أربع بطاقات صيغ اختبار (Unseen Chapter Test, Timed Practice Mock, Blueprint Practice Mock, Full CCP Simulation) تُعرض بنفس الوزن البصري تمامًا دون أي تجميع حسب المرحلة، بالإضافة إلى بطاقة تفسيرية طويلة عن طريقة تصحيح الامتحان الحقيقي تشغل مساحة كبيرة ضمن التدفق الرئيسي، و"Memo Practice" مدفونة داخل مجموعة "Also here" غير المصنّفة.

**ملاحظة هامة:** خلال هذا التدقيق تم في البداية الاشتباه بوجود "خلل عام" (bug) في آلية الطي (CSS) يجعل كل العناصر المطوية تظهر دائمًا. تم التحقق من هذا الافتراض بلقطات شاشة حقيقية (وليس فقط بفحص خصائص DOM)، وتبيّن أنه **غير صحيح** — آلية الطي تعمل بشكل سليم فعليًا. تم استبعاد هذا "الإصلاح" المُقترَح خطأً قبل أي تنفيذ، حرصًا على عدم إجراء تغييرات غير ضرورية أو خاطئة.

---

## جدول الجرد الكامل (Feature Inventory)

| Feature | الدور الحالي (Current role) | الظهور الحالي (Current visibility) | التوصية (Recommendation) | السبب (Reason) |
|---|---|---|---|---|
| **Today** (tab) | نقطة الدخول الرئيسية، توصية واحدة يومية | ظاهر دائمًا في شريط التنقل | **KEEP VISIBLE** | يطابق البنية المطلوبة تمامًا |
| **Study** (tab) | بدء دراسة فصل جديد | ظاهر دائمًا | **KEEP VISIBLE** | يطابق البنية المطلوبة |
| **Fix Weak Areas** (tab) | جلسة تصحيح تلقائية واحدة | ظاهر دائمًا | **KEEP VISIBLE** | يطابق البنية المطلوبة |
| **Exam Practice** (tab) | تمارين شبيهة بالامتحان | ظاهر دائمًا | **KEEP VISIBLE** | يطابق البنية المطلوبة |
| **Progress** (tab) | حالة التقدّم والجاهزية | ظاهر دائمًا | **KEEP VISIBLE** | يطابق البنية المطلوبة |
| **More** (tab) | مدخل ثانوي للأدوات اليدوية | ظاهر دائمًا | **KEEP VISIBLE** | هذا هو الغرض المقصود منه بالضبط |
| بطاقة "WHAT TO DO NEXT" (توصية Today) | تحدد أفضل إجراء تالٍ واحد فقط عبر محرك القرار (recommendedNextStep) | ظاهرة بالكامل، بدون منافسة | **KEEP VISIBLE** | هذا هو جوهر مبدأ "Today = Orchestrator" |
| بطاقة "Chapter X Progress" (سلّم البوابات: Practice → New Questions → Mastery → Challenge → Refresh) | يوضح أين يقف الطالب ضمن رحلة الفصل الحالي | ظاهرة عند وجود فصل نشط | **KEEP VISIBLE** | سياق داعم للتوصية الرئيسية، وليس خيارًا منافسًا |
| "Evidence details" (شرح تقني لحالة الإتقان) | تفاصيل تقنية عن سبب الحالة الحالية | **مطوي فعليًا بشكل صحيح** (`<details>`) | **KEEP BUT HIDE** | تم التحقق بلقطة شاشة أنه مطوي فعلاً — لا تغيير مطلوب |
| "Choose a Chapter →" | الإجراء الرئيسي لبدء دراسة فصل | ظاهر، زر أساسي | **KEEP VISIBLE** | هذا هو "ماذا أدرس الآن؟" المطلوب في الخطوة 5 |
| **Formula Lab** | مرجع صيغ حسابية | ظاهر بجانب الزر الرئيسي مباشرة | **KEEP BUT HIDE** | أداة مرجعية يدوية، تنافس بصريًا الإجراء الرئيسي |
| **Calculation Drill** | تمرين حسابي بأرقام عشوائية | بطاقة كاملة ظاهرة دائمًا | **KEEP BUT HIDE** | أداة تدريب متخصصة، ليست جزءًا من التدفق اليومي الأساسي |
| **Timed Calculation Set** | نفس ما سبق بحدّ زمني | بطاقة كاملة ظاهرة دائمًا | **KEEP BUT HIDE** | نفس السبب |
| **Method Selection** | تمرين اختيار طريقة الحل | بطاقة كاملة ظاهرة دائمًا | **KEEP BUT HIDE** | نفس السبب |
| **Random Practice** (mix chapters) | خلط أسئلة من عدة فصول | **مطوي بالفعل وبشكل صحيح** ضمن "More study options" | **KEEP BUT HIDE** | لا تغيير — مطوي بالفعل بنجاح |
| **Generated Practice** | أسئلة مولّدة آليًا بمعاملات جديدة | مطوي بالفعل | **KEEP BUT HIDE** | لا تغيير |
| **Fresh Challenge (manual)** | اختبار تحويل يدوي | مطوي بالفعل | **KEEP BUT HIDE** | لا تغيير |
| "Advanced options" (إعدادات الجلسة: الصعوبة، النوع، الوقت، التغذية الراجعة الفورية، الثقة) | تخصيص متقدم لأي جلسة | **مطوي بالفعل وبشكل صحيح** | **KEEP BUT HIDE** | تم التحقق بلقطة شاشة — لا تغيير |
| "Start Fix Weak Areas Session →" | جلسة واحدة يختار التطبيق محتواها تلقائيًا (Retention Due/Failed أولاً، ثم Adaptive) | ظاهر، زر أساسي واحد | **KEEP VISIBLE** | هذا بالضبط ما طلبته الخطوة 6 — لا تغيير |
| مربعات الإحصاء (Weak Questions / Wrong to Retry / Need Another Look / Not Fully Solid Yet) | سياق رقمي داعم | ظاهرة | **KEEP VISIBLE** | نتيجة مفيدة، ليست خيارًا يتطلب قرارًا |
| "Open My Mistakes" (Error Notebook) | مراجعة الأخطاء المحفوظة والملاحظات | ظاهر كبطاقة ثانوية واحدة | **KEEP VISIBLE** | زر واحد فقط، لا ينافس الإجراء الرئيسي، مفيد كإجراء يومي بديل |
| **Adaptive Practice** (يدوي) / **Weak Topics Only** / **Wrong Answers Only** / **Topics to Relearn** | بدائل يدوية لاختيار آلية "Fix Weak Areas" بنفسك | **مطوية بالفعل وبشكل صحيح** ضمن "Choose manually instead" | **KEEP BUT HIDE** | لا تغيير — التصميم الحالي صحيح تمامًا |
| **Unseen Chapter Test** | أسئلة لم تُعرض من قبل إطلاقًا (أدلة محمية/نادرة) | بطاقة كاملة الوزن، بلا تمييز عن باقي الصيغ | **KEEP VISIBLE — مع تجميع وتمييز** | يجب توضيح أنها "أدلة محمية/محدودة" ضمن مجموعة Readiness/Transfer |
| **Timed Practice Mock** | تدريب على السرعة والإيقاع باستخدام بنك التدريب | بطاقة كاملة الوزن | **KEEP VISIBLE — مع تجميع** | تنتمي منطقيًا لمجموعة Practice/Pacing |
| **Blueprint Practice Mock (119Q)** | محاكاة كاملة موزّعة حسب أوزان النطاقات الستة | بطاقة كاملة الوزن | **KEEP VISIBLE — مع تجميع** | تنتمي لمجموعة Readiness/Transfer |
| **Full CCP Simulation** | 119 سؤال + مذكرة واحدة ضمن مؤقّت تدريبي 5 ساعات | بطاقة كاملة الوزن | **KEEP VISIBLE — مع تجميع** | تستحق مجموعتها الخاصة (Full Simulation) لأنها أعلى مرحلة |
| **Blueprint Transfer Check (119Q)** | نموذج تحويل أدلة نادرة الاستخدام مرة واحدة | **مطوي حاليًا تحت "More exam-format options"** بمعزل عن باقي الصيغ | **KEEP VISIBLE — نقل إلى مجموعة Readiness/Transfer** | إخفاؤها بمعزلة يجعلها تبدو غير موجودة أصلاً؛ الأصح تصنيفها ظاهرة ضمن مجموعتها المنطقية مع إشارة أنها أدلة محمية |
| **Memo Practice** | تدريب كتابة المذكرة | مدفونة داخل "Also here" مع روابط تنقّل غير متجانسة | **KEEP VISIBLE — نقل إلى مجموعة Communication الخاصة بها** | Memo هي أحد أربعة مجالات تصحيح رسمية بنفس الوزن؛ تستحق تصنيفًا واضحًا وليس دفنها |
| "How the real CCP exam is actually scored" | شرح مرجعي لنظام التصحيح الرسمي (4 مجالات متساوية الوزن) | بطاقة طويلة ظاهرة دائمًا ضمن التدفق الرئيسي | **KEEP BUT HIDE** | معلومة مرجعية قيّمة لكنها ليست "إجراءً"؛ يجب أن تكون على بعد نقرة واحدة فقط |
| **Final Week Review** | مراجعة مركّزة قرب موعد الامتحان | ظاهر (يظهر تلقائيًا كتوصية بارزة عند اقتراب الموعد) | **KEEP VISIBLE** | ذو صلة توقيتية، ليس ضجيجًا |
| "See Full Progress →" | رابط تنقّل بسيط | ظاهر | **KEEP VISIBLE** | مجرد رابط، لا تكلفة معرفية |
| **Training Readiness (MCQ)** | مؤشر جاهزية داخلي من بيانات التدريب | ظاهر في Progress | **KEEP VISIBLE** | إشارة أساسية مطلوبة صراحة في الخطوة 8 |
| **Unseen-Test Readiness** | مؤشر جاهزية منفصل من الأدلة المحمية | ظاهر (رابط "Detail →" للتفاصيل) | **KEEP VISIBLE** | إشارة أساسية مطلوبة |
| **Memo Readiness** | حالة تقييم المذكرة (بشري فقط) | ظاهر | **KEEP VISIBLE** | إشارة أساسية مطلوبة |
| **قائمة الفصول الـ 34 (Chapter states)** | حالة كل فصل (Not Started / Provisional / Retained إلخ) | ظاهرة بالكامل | **KEEP VISIBLE** | مطلوبة صراحة كإشارة أساسية في الخطوة 8؛ لا يجوز طيّها |
| **Weak areas** (نسبة الدقة، عدد الحالات) | ملخص نقاط الضعف | **مفتوح افتراضيًا (`open`) وبشكل صحيح** | **KEEP VISIBLE** | لا تغيير — التصميم الحالي صحيح |
| "Full technical evidence view →" | رابط لشاشة الأدلة التقنية التفصيلية | رابط نصي بسيط | **KEEP BUT HIDE** | يقود لشاشة متقدمة، والرابط نفسه غير مزعج |
| "Mistakes & final review" / "Chapters — all attempts (raw accuracy)" / "Session history & pacing" / "Data & export" | تفاصيل ثانوية ووظائف الصيانة | **مطوية بالفعل وبشكل صحيح** | **KEEP BUT HIDE** | لا تغيير — التصميم الحالي صحيح تمامًا |
| **Export progress / Import progress / Reset all progress / Export Coach Diagnostic** | إدارة البيانات المحفوظة | ظاهرة داخل قسم "Data & export" المطوي، ومكررة في More | **KEEP BUT HIDE** | إجراءات نادرة الاستخدام ومناسبة تمامًا لمكانها الحالي |
| **Chapter Evidence (advanced)** | شاشة أدلة تفصيلية لكل فصل | زر واحد داخل More، معنون صراحة "(advanced)" | **KEEP BUT HIDE** | التصنيف الحالي دقيق ولا حاجة لتغييره |
| **Performance Dashboard** (شاشة منفصلة تضم "Blueprint Task Coverage — 76 Tasks") | لوحة تقنية تفصيلية شاملة | **غير مرتبطة إطلاقًا بتبويب Progress الرئيسي** — تُفتح فقط بعد إنهاء Blueprint Mock أو من مسار الاستيراد أو من رابط داخل شاشة تفصيل الفصل | **KEEP BUT HIDE** | مدفونة بالفعل بشكل مناسب خارج المسار الأساسي؛ لا حاجة لأي تغيير |
| **Chapter Drilldown** (تفصيل مستوى الموضوعات داخل فصل) | تفصيل الإتقان لكل موضوع فرعي | يُفتح بالضغط على أي فصل في القائمة | **KEEP BUT HIDE** | عمق ثانوي طبيعي ومناسب |
| **Weakness Report (كامل)** | تقرير موسّع لنقاط الضعف | رابط من قسم "Weak areas" | **KEEP BUT HIDE** | تفصيل اختياري، الملخص الأساسي ظاهر بالفعل |
| **Session History** (شاشة كاملة) | سجل الجلسات والدقة الزمنية | زر داخل More وداخل القسم المطوي في Progress | **KEEP BUT HIDE** | مناسب لمكانه الحالي |
| **Readiness Center** (شاشة قديمة منفصلة) | كانت تجمع مؤشرات الجاهزية | **لا يوجد أي زر حي يؤدي إليها في الواجهة الحالية** (تم تجاوزها بواسطة شاشة Progress الموحّدة) | **REMOVE FROM STUDENT UI** (تأكيد فقط — غير مُعرَّضة أصلاً) | كود ميت (dead code) من الناحية الملاحية؛ لا تغيير مطلوب لأنها غير ظاهرة أصلاً، لكن يُذكر للتوثيق |
| **Study Plan** (شاشة مستقلة) | كانت تعرض خطة دراسة منفصلة | **لا يوجد زر حي يفتحها مباشرة**؛ تُستخدم داخليًا فقط كمسار احتياطي ضمن منطق التنقّل بعد إتقان فصل | **REMOVE FROM STUDENT UI** (تأكيد فقط) | نفس الحالة أعلاه |
| **AI Pack Manager** | إدارة حزم أسئلة مولّدة بالذكاء الاصطناعي | **لا يوجد زر حي** | **REMOVE FROM STUDENT UI** (تأكيد فقط) | غير مُعرَّضة أصلاً في الواجهة الحالية |
| **Build Integrity / Self-check** | فحص ذاتي تقني للنسخة المحلية | **لا يوجد زر حي** — أداة مطوّرين بحتة | **REMOVE FROM STUDENT UI** (تأكيد فقط) | لا علاقة لها بتجربة الطالب أصلاً |
| **Friction Log (Bug/Confusion Log)** | تسجيل الطالب لملاحظات/مشاكل الاستخدام | لا يوجد زر حي حاليًا (متاح داخليًا فقط) | **KEEP BUT HIDE إن رُبطت مستقبلاً** | مفيدة لكنها ليست جزءًا من الدراسة اليومية |
| **Issues Manager** (الإبلاغ عن سؤال) | إدارة الأسئلة المُبلَّغ عنها من الطالب | يُفتح فقط من داخل تدفّق "الإبلاغ عن سؤال" أثناء حل الأسئلة | **KEEP BUT HIDE** | نطاق ظهورها محدود بالسياق المناسب فقط، وهذا صحيح |
| **Mastery / Retention / SRS / High-Confidence Wrong / Fragile Knowledge / Blueprint Task evidence / Seen Ledger / Quality Gate / Adaptive weighting** | المحرّكات الذكية الأساسية للتطبيق | **لا تملك أي واجهة إدارة مباشرة أصلاً** — تظهر فقط كنتائج نصية (عدد المفاهيم الخاطئة، حالة الفصل، إلخ) | **BACKGROUND ONLY** (تأكيد — الوضع الحالي مثالي) | هذا بالضبط ما تطلبه الخطوة 9: "النتيجة ظاهرة، الآلية مخفية" — لا تغيير مطلوب |

---

## A. مشاكل تجربة المستخدم الحالية (Current UX problems)

1. **شاشة Study تُظهر أربع أدوات حسابية متخصصة (Formula Lab, Calculation Drill, Timed Calculation Set, Method Selection) بنفس وزن الإجراء الرئيسي "Choose a Chapter"**، رغم أنها أدوات مساعدة يستخدمها الطالب أحيانًا فقط، وليست جزءًا من الرحلة اليومية الأساسية (Practice → Apply → Mastery → Challenge → Retention).
2. **شاشة Exam Practice تعرض أربع صيغ اختبار بنفس الوزن البصري تمامًا** دون أي إشارة إلى أن بعضها "أدلة محمية/نادرة الاستخدام" (Unseen Chapter Test, Blueprint Transfer Check) بينما البعض الآخر "تدريب متكرر" (Timed Practice Mock)، أو أن Full Simulation هي المرحلة النهائية الأشمل.
3. **"Memo Practice" مدفونة** داخل مجموعة "Also here" مع رابطي تنقّل غير متجانسين (Final Week Review، See Full Progress)، رغم أن المذكرة هي أحد أربعة مجالات تصحيح رسمية متساوية الوزن — هذا قد يجعل الطالب لا يعطيها الأهمية الصحيحة.
4. **بطاقة شرح نظام التصحيح الرسمي طويلة وتشغل مساحة كبيرة** ضمن التدفق الرئيسي لشاشة Exam Practice، رغم أنها معلومة مرجعية وليست إجراءً يحتاج الطالب اتخاذه كل مرة يفتح فيها الشاشة.
5. **Blueprint Transfer Check مطوية بمعزل عن باقي صيغ الاختبار المشابهة لها منطقيًا (Unseen Chapter Test, Blueprint Mock)**، مما يجعلها تبدو أقل أهمية أو غير موجودة، بينما هي في الواقع أداة تقييم شرعية ومتكافئة مع أخواتها من حيث الغرض.

*(لا توجد مشاكل مؤكدة في: التنقّل الرئيسي، شاشة Today، شاشة Fix Weak Areas، شاشة Progress، شاشة إعداد الجلسة، شاشة More — جميعها فُحصت مباشرة بلقطات شاشة حقيقية وتبيّن أنها مطابقة بالفعل للتصميم المطلوب.)*

## B. رحلة الطالب المبسّطة المقترحة (Proposed simplified student journey)

```
Today
  → توصية واحدة واضحة (Fix misconception / Retention Test / Continue Chapter / Start Chapter X)
  → زر إجراء واحد فقط

Study
  → "Choose a Chapter →" (الإجراء الرئيسي الوحيد الظاهر)
  → [مطوي] Additional Practice: Formula Lab, Calculation Drill, Timed Calculation Set,
     Method Selection, Random Practice, Generated Practice, Fresh Challenge

Fix Weak Areas
  → "Start Fix Weak Areas Session →" (بدون تغيير — مثالية بالفعل)

Exam Practice — مُنظّمة حسب المرحلة بدلاً من قائمة مسطّحة:
  PRACTICE / PACING           → Timed Practice Mock
  READINESS / TRANSFER        → Unseen Chapter Test (أدلة محمية) · Blueprint Mock · Blueprint Transfer Check (أدلة محمية)
  COMMUNICATION                → Memo Practice
  FULL SIMULATION               → Full CCP Simulation
  [مطوي] كيف يُصحَّح الامتحان الحقيقي فعليًا

Progress
  → بدون تغيير — مثالية بالفعل (Readiness + Memo Readiness + حالة الفصول + Weak areas ظاهرة،
     والتفاصيل التقنية مطوية بالفعل)

More
  → بدون تغيير — مثالية بالفعل كمدخل ثانوي للأدوات المتقدمة
```

## C. التغييرات الدقيقة المزمع تنفيذها في الواجهة (Exact UI changes)

1. في دالة عرض شاشة Study (`renderPracticeCenter`): نقل زر **Formula Lab** وبطاقة **Calculation practice** بأكملها (Calculation Drill, Timed Calculation Set, Method Selection) إلى داخل القسم المطوي الموجود أصلاً، وإعادة تسميته من "More study options" إلى **"Additional Practice"** ليشمل الآن: Formula Lab, Calculation Drill, Timed Calculation Set, Method Selection, Random Practice, Generated Practice, Fresh Challenge (manual). تبقى شاشة Study الأساسية ببطاقة واحدة فقط: "Choose a Chapter".
2. في دالة عرض شاشة Exam Practice (`renderExamCenter`):
   - تقسيم شبكة الصيغ الأربع إلى مجموعات معنونة: **"PRACTICE / PACING"** (Timed Practice Mock)، **"READINESS / TRANSFER"** (Unseen Chapter Test، Blueprint Practice Mock، Blueprint Transfer Check)، **"FULL SIMULATION"** (Full CCP Simulation).
   - إضافة سطر توضيحي صغير تحت Unseen Chapter Test و Blueprint Transfer Check يوضح أنها "أدلة محمية/محدودة الاستخدام" (protected, one-time evidence).
   - نقل **Blueprint Transfer Check** من القسم المطوي المنفصل إلى مجموعة "READINESS / TRANSFER" الظاهرة، وحذف القسم المطوي الفارغ بعد ذلك.
   - نقل **Memo Practice** إلى مجموعة مستقلة معنونة **"COMMUNICATION"** بدلاً من دفنها ضمن "Also here".
   - إبقاء "Final Week Review" و "See Full Progress →" كروابط ثانوية بسيطة أسفل الشاشة (لم تعد ضمن "Also here" المختلطة).
   - طيّ بطاقة **"How the real CCP exam is actually scored"** خلف عنصر `<details>` قابل للفتح بنقرة واحدة، بدلاً من عرضها دائمًا ضمن التدفق الرئيسي — دون تغيير أي كلمة من محتواها.
3. **لا تغيير إطلاقًا** في: Today، Fix Weak Areas، Progress، More، شاشة إعداد الجلسة (config)، أو أي نص/منطق يتعلق بالـ Mastery، Retention، SRS، Blueprint، Memo، أو نظام التصحيح.

## D. ميزات يبقى محرّكها سليمًا تمامًا لكن مدخلها اليدوي يصبح ثانويًا

| Feature | حالة المحرّك (Engine) | حالة المدخل اليدوي بعد التعديل |
|---|---|---|
| Formula Lab | سليم 100%، بدون أي تغيير في المحتوى المرجعي | يظهر داخل "Additional Practice" المطوية بدلاً من بجانب الزر الرئيسي |
| Calculation Drill | سليم 100% | داخل "Additional Practice" |
| Timed Calculation Set | سليم 100% | داخل "Additional Practice" |
| Method Selection | سليم 100% | داخل "Additional Practice" |
| Blueprint Transfer Check | سليم 100%، لا تغيير في منطق الأدلة المحمية أو خوارزمية الاختيار | يظهر الآن ضمن مجموعة "Readiness / Transfer" الظاهرة (تمت ترقيته من مطوي منفصل إلى ظاهر ومصنّف، وليس العكس) |
| "How the real CCP exam is actually scored" | سليم 100%، نفس النص بالضبط بدون أي حرف تغيير | يظهر بنقرة واحدة عبر عنصر مطوي بدلاً من الظهور الدائم |

**لم يتم إزالة أي مدخل يدوي كان يعمل سابقًا.** التغيير الوحيد هو مكان ووزن ظهوره على الشاشة.

---

## تأكيد الالتزام بقواعد التجميد (Freeze Rules)

تم التحقق من الكود الحي وتأكيد عدم الحاجة لأي تعديل في: بنك الأسئلة الـ 830، مفاتيح الأسئلة (IDs)، نصوص الأسئلة، مفاتيح الإجابة، الشروحات، المصادر، الصيغ الحسابية، بيانات blueprintTasks، خرائط V527/V528، منطق أدلة Blueprint، عتبات الإتقان (Mastery thresholds)، منطق Apply/Mastery/Challenge/Retention/SRS/High-Confidence Wrong/Unseen evidence، بوابات Official Study Guide، منطق المذكرة (Memo)، Memo Readiness، Training Readiness، منطق اختيار Blueprint Mock وحصصه، محرك Full Simulation، منطق التصحيح، بنية الحفظ (persistence)، سلوك Export/Import، أو مخطط بيانات PROGRESS.

**كل التغييرات المذكورة أعلاه هي تغييرات HTML/عرض (markup) بحتة داخل دالتين فقط: `renderPracticeCenter()` و `renderExamCenter()`.**
