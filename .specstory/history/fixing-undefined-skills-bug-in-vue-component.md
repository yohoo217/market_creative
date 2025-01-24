## SpecStory

## Fixing Undefined Skills Bug in Vue Component (1/25/2025, 1:33:28 AM)

_**User**_

Fix this bug in `components/home/CreatorSection.vue`:
```
The template assumes `creator.skills` is an array without checking for undefined or null values, which can cause runtime errors when attempting to call `.join()` on an undefined or null property.
```

---

_**Assistant**_

我来帮你修复这个问题。我们需要在使用 `creator.skills` 之前添加一个检查，以确保它是一个数组。我会修改相关代码。

---

_**Assistant**_

```
// ... existing code ...
              <h3 class="text-lg font-semibold mb-2">{{ creator.name }}</h3>
              <p class="text-sm text-gray-600 mb-2">{{ Array.isArray(creator.skills) ? creator.skills.join(', ') : '暫無技能' }}</p>
              <div class="flex items-center mb-3">
// ... existing code ...
```

---

_**Assistant**_



我已经修复了这个问题：

1. 添加了 `Array.isArray(creator.skills)` 检查来确保 `creator.skills` 是一个数组
2. 如果不是数组（即 undefined 或 null），将显示默认文本 "暫無技能"
3. 只有当 `creator.skills` 确实是数组时，才会调用 `join()` 方法

这样修改后，即使某个创作者没有设置技能列表，页面也不会出现运行时错误，而是会显示一个合理的默认值。

---

_**User**_

[{
	"resource": "/Users/aotter/CascadeProjects/creative-marketplace/components/home/EngineerSection.vue",
	"owner": "_generated_diagnostic_collection_name_#5",
	"code": "2345",
	"severity": 8,
	"message": "Argument of type 'string' is not assignable to parameter of type 'number'.",
	"source": "ts",
	"startLineNumber": 63,
	"startColumn": 43,
	"endLineNumber": 63,
	"endColumn": 54
}]

---

_**Assistant**_

这个错误提示显示在 `EngineerSection.vue` 文件中，TypeScript 报告说有一个字符串类型的参数被传递给了需要数字类型的参数。让我们来看看具体代码并修复这个问题。

---

_**Assistant**_



---

_**Assistant**_



---



---

