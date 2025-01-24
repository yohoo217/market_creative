## SpecStory

## Fixing Type Mismatch in EngineerSection.vue (1/25/2025, 1:31:57 AM)

_**User**_

Fix this bug in `components/home/EngineerSection.vue`:
```
The `contactEngineer` function passes a string `engineerId` to the router, causing a type mismatch error when navigating to the engineer contact page. The route expects a number, but a string is being provided.
```

---

_**Assistant**_

我来帮你修复这个类型不匹配的问题。我们需要确保 `engineerId` 在传递给路由时是正确的数字类型。

让我先查看一下相关代码：

---

_**Assistant**_



---

_**Assistant**_



我现在将修改 `contactEngineer` 函数，将 `engineerId` 参数类型从 `string` 改为 `number`，并确保在使用时进行正确的类型转换：

---

_**Assistant**_

```
// ... existing code ...
// 聯絡工程師
const contactEngineer = (engineerId: number) => {
  router.push(`/engineers/${engineerId}/contact`)
}
// ... existing code ...
```

---

_**Assistant**_



我已经修复了这个类型不匹配的问题：

1. 将 `contactEngineer` 函数的参数类型从 `string` 改为 `number`
2. 由于 `engineer.id` 在模板中被使用时应该已经是 `number` 类型，所以不需要额外的类型转换

这样修改后，当点击"聯絡工程師"按钮时，传递给路由的 `engineerId` 将会是正确的数字类型。

如果你在测试过程中发现任何其他问题，请告诉我。

---



---

