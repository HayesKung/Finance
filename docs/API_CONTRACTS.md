# API_CONTRACTS

这些都是服务函数，不是已对公网承诺的开放 API。

| 函数 | 谁可以调用 | 失败时 |
|---|---|---|
| `whoami` | 任何人，只返回是否已配置和当前角色 | 不返回口令 |
| `loginStaff` | 持有环境变量中口令的人 | 统一报“密码不正确”或“稍后再试” |
| `logoutStaff` | 当前会话 | 清 cookie |
| `publishContract` / `readStaffContract` / `loadDesk` / `saveDesk` | owner 或 support | 无会话返回“没有权限” |
| `saveChannel` / `revokeContract` | 仅 owner | support 会被拒绝 |
| `readContract` / `customerSign` / `customerClaim` | 持有未过期、未撤销的客户 token | 无效、过期、撤销都表现为没有这张确认书；连续无效请求会被限流 |
| `channelStatus` | owner 或 support | 只返回三个布尔值 |

`customerClaim` 只记录客户声称已转账。它不增加实收。实收由工作人员在订单里登记，且不能把已登记金额直接改小。

`saveDesk` 使用事务和 `pg_advisory_xact_lock`。版本不一致时整次拒绝。同一份内容重复提交不会把版本再加一次。
