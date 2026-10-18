export interface ArticleSection {
  id: string;
  title: string;
  bulletText?: string;
  paragraphs: string[];
  codeSnippets?: {
    language: string;
    code: string;
    explanation?: string;
  }[];
  proposalRef?: {
    text: string;
    title: string;
    paperId: string;
    summary: string;
    linkUrl?: string;
  };
}

export interface Article {
  id: string;
  title: string;
  date: string;
  year: string;
  month: string;
  summary: string;
  topics: string[];
  readingTime: string;
  wordCount: number;
  sections: ArticleSection[];
}

export interface ArchiveYear {
  year: string;
  months: {
    month: string;
    articles: {
      id: string;
      title: string;
      date: string;
    }[];
  }[];
}

export const BLOG_TITLE = "败犬日报";

export const AUTHOR_INFO = {
  name: "败犬 (Underdog)",
  tagline: "系统级程序员 / 现代 C++ 与 Rust 探索者",
  bio: "写 C++、玩 Rust，关注底层系统性能、编译期黑魔法与现代硬件架构。不定期更新日常踩坑与技术思辨。",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
  github: "https://github.com/underdog-dev",
  rssUrl: "https://baiquan.daily/rss.xml",
  email: "dev@baiquan.daily",
  stats: {
    postsCount: 42,
    categoriesCount: 6,
    runningDays: 680,
  },
  skills: ["C++20/23/26", "Rust", "Linux Kernel & eBPF", "Performance Profiling", "LLVM", "Distributed Storage"]
};

export const TOPICS = [
  { name: "C++", count: 19, description: "C++20/23/26 新特性、模板元编程、常量表达式及底层语义" },
  { name: "constexpr", count: 8, description: "编译期求值、类型萃取与模板实例化优化" },
  { name: "Rust", count: 11, description: "所有权模型、生命周期、并发安全与无畏并发" },
  { name: "性能优化", count: 14, description: "Cache Line、SIMD、无锁数据结构与分支预测" },
  { name: "系统编程", count: 12, description: "Linux 虚拟内存、系统调用、eBPF 与网络协议栈" },
  { name: "日常随笔", count: 7, description: "程序员生活琐事、群聊趣事与技术碎碎念" },
];

export const ARTICLES: Article[] = [
  {
    id: "2026-07-25",
    title: "败犬日报 2026-07-25",
    date: "2026-07-25",
    year: "2026",
    month: "07",
    summary: "停更了 3 个月，原因是败犬群和 C++ 切割。后面我打算随便更新了。",
    topics: ["C++", "constexpr", "标准提案"],
    readingTime: "3 分钟",
    wordCount: 840,
    sections: [
      {
        id: "section-1",
        title: "1. 引用能做，指针做不了的事情",
        bulletText: "1. 引用能做，指针做不了的事情",
        paragraphs: [
          "来自周刊群 jajuju。",
          "一直都有“引用是指针的语法糖”的说法，言下之意就是引用能做的，指针一定能做。真的是这样吗？",
          "这个提案讲了，constexpr 函数如果只取了参数的类型信息，那么就算传了变量也可以编译期计算。但是，只能接受引用，不能是指针。",
          "该提案已合入标准，编译器足够新就能用。",
          "于是我们可以完成下面的操作："
        ],
        proposalRef: {
          text: "这个提案",
          title: "P2280R4: Using unknown references in constant expressions",
          paperId: "P2280R4 / C++26",
          summary: "允许在常量求值中引用未知对象，只要其值不被实际读取。对引用而言，仅查询其类型（如推导数组长度、decltype 等）不再判定为未定义行为；而未初始化的指针即使只进行解引用也会因指针值的未知性而失败。",
          linkUrl: "https://wg21.link/p2280"
        },
        codeSnippets: [
          {
            language: "cpp",
            code: `#include <cstddef>

template <typename T, size_t N>
constexpr size_t array_size(T (*)[N]) {
    return N;
}

template <typename T, size_t N>
constexpr size_t array_size(T (&)[N]) {
    return N;
}

void check(int const (*param)[3]) {
    // constexpr auto s = array_size(param);  // error: 'param' is not a constant expression
}

void check(int const (&param)[3]) {
    constexpr auto s = array_size(param);
}`
          }
        ]
      }
    ]
  },
  {
    id: "2026-07-27",
    title: "败犬日报 2026-07-27",
    date: "2026-07-27",
    year: "2026",
    month: "07",
    summary: "谈谈 C++26 模式匹配 (Pattern Matching) 提案最新进展与 inspect 表达式在工程中的应用构想。",
    topics: ["C++", "C++26", "语言设计"],
    readingTime: "5 分钟",
    wordCount: 1250,
    sections: [
      {
        id: "section-1",
        title: "1. 终结 switch-case 的恶梦：inspect 语法",
        bulletText: "1. 终结 switch-case 的恶梦：inspect 语法",
        paragraphs: [
          "在 C++ 中处理 std::variant 或各种多态类型时，std::visit 的样板代码冗长且难读。",
          "P2688 (Pattern Matching: `inspect`) 为 C++26 带来了现代语言特有的结构解构与模式匹配能力。",
          "通过 `inspect`，不仅能够匹配常量值，还能解构 tuple、struct，甚至支持 guard 条件（when 子句）："
        ],
        codeSnippets: [
          {
            language: "cpp",
            code: `// C++26 模式匹配预览
struct Point { int x; int y; };

void handle(const std::variant<int, std::string, Point>& v) {
    inspect (v) {
        0 => std::println("Zero");
        int i if (i > 0) => std::println("Positive: {}", i);
        std::string s => std::println("String: {}", s);
        Point [x, y] => std::println("Point at ({}, {})", x, y);
        _ => std::println("Fallback");
    };
}`
          }
        ]
      }
    ]
  },
  {
    id: "2026-04-12",
    title: "败犬日报 2026-04-12",
    date: "2026-04-12",
    year: "2026",
    month: "04",
    summary: "无锁环形队列 (Lock-Free SPSC Queue) 中的伪共享 (False Sharing) 与缓存行填充实验。",
    topics: ["性能优化", "C++", "并发编程"],
    readingTime: "6 分钟",
    wordCount: 1620,
    sections: [
      {
        id: "section-1",
        title: "1. 为什么你的无锁队列比互斥锁还慢？",
        bulletText: "1. 为什么你的无锁队列比互斥锁还慢？",
        paragraphs: [
          "很多人在写 SPSC（单生产者单消费者）队列时，会把 head 和 tail 索引紧挨着放在同一个结构体中。",
          "在多核 CPU 架构下，两个核心频繁修改同一个 64 字节 Cache Line 会导致激烈的缓存一致性风暴（Cache Invalidation）。",
          "使用 `alignas(std::hardware_destructive_interference_size)` 可以物理隔离开两个指针，使单次 push/pop 延迟下降 60% 以上："
        ],
        codeSnippets: [
          {
            language: "cpp",
            code: `#include <new>
#include <atomic>

template <typename T, size_t Capacity>
class SPSCQueue {
    static constexpr size_t CacheLineSize = 
        std::hardware_destructive_interference_size;

    alignas(CacheLineSize) std::atomic<size_t> head_{0};
    alignas(CacheLineSize) std::atomic<size_t> tail_{0};
    alignas(CacheLineSize) T buffer_[Capacity];
};`
          }
        ]
      }
    ]
  },
  {
    id: "2026-01-18",
    title: "败犬日报 2026-01-18",
    date: "2026-01-18",
    year: "2026",
    month: "01",
    summary: "使用 eBPF 在生产环境无侵入定位高并发连接下的 TIME_WAIT 积压瓶颈。",
    topics: ["系统编程", "性能优化"],
    readingTime: "4 分钟",
    wordCount: 980,
    sections: [
      {
        id: "section-1",
        title: "1. bpftrace 一行命令抓出连接风暴",
        bulletText: "1. bpftrace 一行命令抓出连接风暴",
        paragraphs: [
          "当服务出现瞬时端口耗尽告警时，传统的 netstat / ss 工具自身就会产生严重的 CPU 负载。",
          "利用 eBPF kprobe 挂载在 `tcp_set_state` 上，可以直接统计各个进程状态转换的分布情况："
        ],
        codeSnippets: [
          {
            language: "bash",
            code: `# 统计调用 tcp_set_state 进入 TIME_WAIT 的进程分布
bpftrace -e 'kprobe:tcp_set_state /arg1 == 6/ { @[comm] = count(); }'
`
          }
        ]
      }
    ]
  },
  {
    id: "2025-12-10",
    title: "败犬日报 2025-12-10",
    date: "2025-12-10",
    year: "2025",
    month: "12",
    summary: "std::execution 与 senders/receivers (P2300) 异步编程范式深度解析。",
    topics: ["C++", "并发编程"],
    readingTime: "7 分钟",
    wordCount: 1800,
    sections: [
      {
        id: "section-1",
        title: "1. 摆脱 Callback Hell 的终极方案",
        bulletText: "1. 摆脱 Callback Hell 的终极方案",
        paragraphs: [
          "C++ 历史上的 std::future 饱受批评（无法取消、隐式堆分配、缺乏延续组合能力）。",
          "P2300 定义了 Senders, Receivers 与 Schedulers 概念，让异步管道流像 Unix Shell 管道一样简洁组合："
        ],
        codeSnippets: [
          {
            language: "cpp",
            code: `using namespace std::execution;

auto work = schedule(thread_pool.get_scheduler())
          | then([] { return fetch_data(); })
          | then([](auto data) { return process(data); });

sync_wait(std::move(work));`
          }
        ]
      }
    ]
  },
  {
    id: "2024-10-15",
    title: "败犬日报 2024-10-15",
    date: "2024-10-15",
    year: "2024",
    month: "10",
    summary: "败犬日报开刊词：败犬程序员的摸鱼杂谈与硬核技术自留地。",
    topics: ["日常随笔"],
    readingTime: "2 分钟",
    wordCount: 520,
    sections: [
      {
        id: "section-1",
        title: "1. 为什么叫“败犬日报”？",
        bulletText: "1. 为什么叫“败犬日报”？",
        paragraphs: [
          "在技术演进的大潮里，各种新框架、新名词层出不穷，很多时候我们就像在奔跑中累得喘不过气的败犬。",
          "但败犬也是有尊严的，哪怕被编译器折磨千万遍，看到汇编窗口里那几行精炼的向量化指令，依然能兴奋一整天。",
          "这里会记录一些工作之余的偏门知识、C++ 奇技淫巧以及各种底层实验。欢迎订阅与交流！"
        ]
      }
    ]
  }
];

// Generate structured archives matching the screenshot
export const ARCHIVES: ArchiveYear[] = [
  {
    year: "2024",
    months: [
      {
        month: "10",
        articles: [
          { id: "2024-10-15", title: "败犬日报 2024-10-15", date: "2024-10-15" }
        ]
      },
      { month: "11", articles: [] },
      { month: "12", articles: [] }
    ]
  },
  {
    year: "2025",
    months: [
      { month: "01", articles: [] },
      { month: "02", articles: [] },
      { month: "03", articles: [] },
      { month: "04", articles: [] },
      { month: "05", articles: [] },
      { month: "06", articles: [] },
      { month: "07", articles: [] },
      { month: "08", articles: [] },
      { month: "09", articles: [] },
      { month: "10", articles: [] },
      { month: "11", articles: [] },
      {
        month: "12",
        articles: [
          { id: "2025-12-10", title: "败犬日报 2025-12-10", date: "2025-12-10" }
        ]
      }
    ]
  },
  {
    year: "2026",
    months: [
      {
        month: "01",
        articles: [
          { id: "2026-01-18", title: "败犬日报 2026-01-18", date: "2026-01-18" }
        ]
      },
      { month: "02", articles: [] },
      { month: "03", articles: [] },
      {
        month: "04",
        articles: [
          { id: "2026-04-12", title: "败犬日报 2026-04-12", date: "2026-04-12" }
        ]
      },
      {
        month: "07",
        articles: [
          { id: "2026-07-25", title: "败犬日报 2026-07-25", date: "2026-07-25" },
          { id: "2026-07-27", title: "败犬日报 2026-07-27", date: "2026-07-27" }
        ]
      }
    ]
  }
];
