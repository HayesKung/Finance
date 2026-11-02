# 说明稿模板 / Note template

公开站点的说明稿写在 `sites/www/articles.mjs`。构建时只收录 `published: true` 的条目。文件底部的 `ARTICLE_TEMPLATE` 不会被发布。

新增一篇时，复制下面的对象，追加到 `notes` 数组，两种语言都写完，负责人读过之后再把 `published` 改成 `true`，然后运行 `npm run build:www`。

不要写这些东西，除非你自己握有可以公开的原文：

- 客户名称、客户名单、合作案例
- 业绩、回款比例、节省金额、任何百分比
- 牌照编号、许可范围、办公室地址、电话
- 价格。费用在负责人确认后另行书面约定，不写在网站上
- 法律、审计、投资或税务结论

第一段就要回答标题里的问题，并写明这不是上述意见。相关链接只指向本站已经公开的服务、流程、问答或咨询页。

```js
{
  slug: "your-slug",
  date: "YYYY-MM-DD",
  published: false,
  image: "export.svg",
  related: ["services/export.html", "faq.html"],
  zh: {
    title: "用问句写出读者会搜的问题？",
    description: "一两句答案。不写数字，不写客户，不写牌照。",
    lede: "第一段就回答标题。写明这不是法律、审计、投资或税务意见。",
    sections: [
      { h: "这一节讲什么", paragraphs: ["只写本站已经公开的做法。"], list: ["栏目一"] },
      { h: "这一节不承诺什么", paragraphs: ["写明边界。"] },
    ],
  },
  en: {
    title: "The question a reader would type?",
    description: "The answer in one or two sentences. No figures, clients or licenses.",
    lede: "Answer the title in the first paragraph. Say this is not legal, audit, investment or tax advice.",
    sections: [
      { h: "What this section explains", paragraphs: ["Stay inside what the site already says."], list: ["Item one"] },
      { h: "What this section does not promise", paragraphs: ["State the boundary."] },
    ],
  },
}
```

`image` 只能用 `sites/www/assets/` 里已有的示意图：`export.svg`、`project.svg`、`collect.svg`、`report.svg`。不要换上客户照片或图库图片。

`date` 用你审阅通过的日期。站点地图会用这个日期。
