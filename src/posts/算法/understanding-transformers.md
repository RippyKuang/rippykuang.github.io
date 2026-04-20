---
title: "Understanding Transformers & Self-Attention"
date: "2026-04-15"
excerpt: "深入分析 Transformer 架构中的自注意力机制，包含详细的数学公式推导与代码实现。"
---
# Understanding Transformers

Transformer 架构自 2017 年提出以来，彻底改变了自然语言处理领域。其核心在于 **Self-Attention（自注意力机制）**。

## Self-Attention 公式

自注意力机制的计算公式如下：

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$

- $Q$ 代表 Query（查询）
- $K$ 代表 Key（键）
- $V$ 代表 Value（值）
- $d_k$ 是 Key 向量的维度

这里除以 $\sqrt{d_k}$ 是为了缩放点积结果，防止梯度的消失问题。这是机器学习中非常优雅的设计。

## 代码示例

下面是一个简单的 Attention 模块实现结构（伪代码）：

```python
import torch
import torch.nn.functional as F
import math

def scaled_dot_product_attention(q, k, v, mask=None):
    d_k = q.size()[-1]
    scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(d_k)
    
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
        
    attention_weights = F.softmax(scores, dim=-1)
    output = torch.matmul(attention_weights, v)
    return output, attention_weights
```

Transformer 的出现让我们能够高度并行化地处理序列数据。
