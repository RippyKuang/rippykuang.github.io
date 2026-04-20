---
title: "机器的觉醒：吴恩达机器学习课程笔记"
date: "2026-04-19"
excerpt: "重新温习经典的机器学习课程，整理了回归算法与神经网络架构的底层原理。"
---
# 机器学习基石

最近我重新看了一遍经典课程，对反向传播算法有了更深刻的了解。

回归分析是预测连续值的最基本方法。当我们理解了代价函数（Cost Function），一切都变得清晰起来。

## 梯度下降法代码分享

```python
def gradient_descent(x, y, w, b, alpha, num_iters):
    m = len(x)
    for i in range(num_iters):
        f_wb = w * x + b
        dj_dw = (1/m) * sum((f_wb - y)*x)
        dj_db = (1/m) * sum(f_wb - y)
        w = w - alpha * dj_dw
        b = b - alpha * dj_db
    return w, b
```

继续在学习的路途上保持好奇。
