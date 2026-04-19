"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type StatusTone = "ok" | "watch" | "risk";
type RiskLevel = "high" | "medium" | "low";

function cn(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function formatCNY(value: number) {
  if (value >= 100_000_000) return `¥${(value / 100_000_000).toFixed(2)}亿`;
  if (value >= 10_000) return `¥${(value / 10_000).toFixed(1)}万`;
  return `¥${value.toLocaleString("zh-CN")}`;
}

function formatPct(value: number, digits = 1) {
  return `${value.toFixed(digits)}%`;
}

function TrendSpark({ data, tone }: { data: number[]; tone: StatusTone }) {
  const points = useMemo(() => {
    if (data.length < 2) return "";
    const min = Math.min(...data);
    const max = Math.max(...data);
    const span = Math.max(1e-9, max - min);
    const w = 96;
    const h = 28;
    const pad = 2;
    return data
      .map((v, i) => {
        const x = (i / (data.length - 1)) * (w - pad * 2) + pad;
        const y = (1 - (v - min) / span) * (h - pad * 2) + pad;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");
  }, [data]);

  const stroke =
    tone === "ok"
      ? "rgb(16 185 129)"
      : tone === "watch"
        ? "rgb(245 158 11)"
        : "rgb(239 68 68)";

  return (
    <svg viewBox="0 0 96 28" className="h-7 w-24">
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
        opacity="0.95"
      />
    </svg>
  );
}

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: StatusTone;
}) {
  const cls =
    tone === "ok"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : tone === "watch"
        ? "bg-amber-50 text-amber-700 ring-amber-200"
        : "bg-rose-50 text-rose-700 ring-rose-200";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        cls,
      )}
    >
      {children}
    </span>
  );
}

function RiskBadge({ level }: { level: RiskLevel }) {
  const cls =
    level === "high"
      ? "bg-rose-50 text-rose-700 ring-rose-200"
      : level === "medium"
        ? "bg-amber-50 text-amber-700 ring-amber-200"
        : "bg-sky-50 text-sky-700 ring-sky-200";
  const label = level === "high" ? "高" : level === "medium" ? "中" : "低";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
        cls,
      )}
    >
      风险{label}
    </span>
  );
}

function Icon({ name }: { name: string }) {
  const base = "h-4 w-4";
  switch (name) {
    case "bell":
      return (
        <svg
          className={base}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
          <path d="M9 17a3 3 0 0 0 6 0" />
        </svg>
      );
    case "spark":
      return (
        <svg
          className={base}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2l1.2 5.4L18 9l-4.8 1.6L12 16l-1.2-5.4L6 9l4.8-1.6L12 2z" />
          <path d="M5 14l.7 3.2L9 18l-3.3.8L5 22l-.7-3.2L1 18l3.3-.8L5 14z" />
        </svg>
      );
    case "chev":
      return (
        <svg
          className={cn(base, "opacity-70")}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      );
    case "arrowUp":
      return (
        <svg
          className={base}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 19V5" />
          <path d="M5 12l7-7 7 7" />
        </svg>
      );
    case "arrowDown":
      return (
        <svg
          className={base}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 5v14" />
          <path d="M19 12l-7 7-7-7" />
        </svg>
      );
    case "bot":
      return (
        <svg
          className={cn(base, "h-5 w-5")}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 8V4" />
          <path d="M8 4h8" />
          <rect x="4" y="8" width="16" height="12" rx="3" />
          <path d="M9 13h.01" />
          <path d="M15 13h.01" />
          <path d="M9 17h6" />
        </svg>
      );
    default:
      return (
        <span className={cn("inline-block", base)} aria-hidden="true" />
      );
  }
}

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-200/70 bg-white/90 shadow-sm shadow-zinc-200/40 backdrop-blur supports-[backdrop-filter]:bg-white/70",
        className,
      )}
    >
      {children}
    </div>
  );
}

function CardHeader({
  title,
  description,
  right,
}: {
  title: string;
  description?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-zinc-900">{title}</div>
        {description ? (
          <div className="mt-1 text-xs leading-5 text-zinc-500">
            {description}
          </div>
        ) : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

function CardBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("px-5 py-4", className)}>{children}</div>;
}

function Table({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200/70">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "bg-zinc-50/70 px-3 py-2 text-left text-xs font-semibold text-zinc-600",
        className,
      )}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("border-t border-zinc-100 px-3 py-2", className)}>
      {children}
    </td>
  );
}

function Button({
  children,
  variant = "default",
  size = "sm",
  onClick,
  className,
  title,
}: {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md";
  onClick?: () => void;
  className?: string;
  title?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50";
  const sizes =
    size === "md" ? "h-10 px-4 text-sm" : "h-9 px-3 text-sm";
  const variants =
    variant === "default"
      ? "bg-zinc-900 text-white hover:bg-zinc-800"
      : variant === "secondary"
        ? "bg-sky-50 text-sky-800 hover:bg-sky-100"
        : variant === "outline"
          ? "border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900"
          : "bg-transparent hover:bg-zinc-50 text-zinc-900";
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(base, sizes, variants, className)}
    >
      {children}
    </button>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 appearance-none rounded-lg border border-zinc-200 bg-white px-3 pr-8 text-sm text-zinc-900 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
        <Icon name="chev" />
      </div>
    </div>
  );
}

function Delta({ value }: { value: number }) {
  const up = value >= 0;
  const cls = up ? "text-emerald-700" : "text-rose-700";
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium", cls)}>
      <span className="inline-flex items-center">
        <Icon name={up ? "arrowUp" : "arrowDown"} />
      </span>
      {`${Math.abs(value).toFixed(1)}%`}
      <span className="text-zinc-500 font-normal">vs 昨日</span>
    </span>
  );
}

function KpiCard({
  name,
  value,
  delta,
  tone,
  spark,
  hint,
}: {
  name: string;
  value: string;
  delta: number;
  tone: StatusTone;
  spark: number[];
  hint: string;
}) {
  const toneLabel = tone === "ok" ? "正常" : tone === "watch" ? "关注" : "风险";
  return (
    <Card className="group relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-sky-500/0 via-sky-500/30 to-sky-500/0 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-medium text-zinc-500">{name}</div>
            <div className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
              {value}
            </div>
            <div className="mt-2">
              <Delta value={delta} />
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge tone={tone}>{toneLabel}</Badge>
            <TrendSpark data={spark} tone={tone} />
          </div>
        </div>
        <div className="mt-3 text-xs leading-5 text-zinc-500">
          <span className="opacity-70">提示：</span>
          {hint}
        </div>
      </div>
    </Card>
  );
}

function Drawer({
  open,
  onClose,
  children,
  title,
  subtitle,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-zinc-900/25 transition-opacity",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute right-0 top-0 h-full w-full max-w-[520px] transform transition-transform",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-full flex-col bg-white shadow-xl">
          <div className="border-b border-zinc-100 px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-zinc-900">
                  {title}
                </div>
                {subtitle ? (
                  <div className="mt-1 text-xs text-zinc-500">{subtitle}</div>
                ) : null}
              </div>
              <Button variant="ghost" onClick={onClose} className="-mr-1">
                关闭
              </Button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [now, setNow] = useState<Date>(() => new Date());
  const [factory, setFactory] = useState("sd-1");
  const [activeNav, setActiveNav] = useState<
    "overview" | "production" | "quality" | "performance" | "risk" | "ai"
  >("overview");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiSelectedPrompt, setAiSelectedPrompt] = useState<string | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1_000);
    return () => window.clearInterval(id);
  }, []);

  const mock = useMemo(() => {
    const weekTrend = [
      { day: "周一", orders: 94, output: 86 },
      { day: "周二", orders: 102, output: 92 },
      { day: "周三", orders: 98, output: 96 },
      { day: "周四", orders: 110, output: 101 },
      { day: "周五", orders: 121, output: 108 },
      { day: "周六", orders: 88, output: 84 },
      { day: "周日", orders: 76, output: 70 },
    ];

    const workshopPerf = [
      { name: "卷簧车间", score: 86, oee: 82 },
      { name: "压簧车间", score: 88, oee: 84 },
      { name: "热处理车间", score: 79, oee: 71 },
      { name: "质检中心", score: 90, oee: 88 },
      { name: "包装出货组", score: 84, oee: 80 },
    ];

    const kpis = {
      orderAmount: { value: 3_480_000, delta: 4.2, tone: "ok" as const },
      dailyOutput: { value: 186_500, delta: -2.6, tone: "watch" as const },
      firstPassYield: { value: 97.3, delta: 0.8, tone: "ok" as const },
      onTimeDelivery: { value: 96.1, delta: -0.7, tone: "watch" as const },
      oee: { value: 78.4, delta: -3.8, tone: "risk" as const },
      attendance: { value: 93.2, delta: -1.9, tone: "watch" as const },
    };

    const orderRisk = [
      {
        id: "SO-2026-0419-013",
        customer: "宁波某汽车零部件",
        type: "热处理瓶颈 / 夜班人手不足",
        delayDays: 2,
        owner: "生产部",
        status: "已升级排产",
        level: "high" as const,
      },
      {
        id: "SO-2026-0419-008",
        customer: "苏州某精密器件",
        type: "质检复检占用工时",
        delayDays: 1,
        owner: "质量部",
        status: "复检中",
        level: "medium" as const,
      },
      {
        id: "SO-2026-0418-026",
        customer: "上海某机器人集成商",
        type: "材料到货偏差 / 需补料",
        delayDays: 3,
        owner: "采购部",
        status: "供应商协调",
        level: "high" as const,
      },
      {
        id: "SO-2026-0419-021",
        customer: "杭州某电机厂",
        type: "包装工位节拍波动",
        delayDays: 1,
        owner: "仓储物流部",
        status: "已加派人手",
        level: "low" as const,
      },
    ];

    const anomalies = [
      {
        name: "热处理炉 #3 停机",
        area: "热处理车间",
        impact: "high" as const,
        owner: "设备部 / 王工",
        due: "今日 18:30",
        status: "处理中",
      },
      {
        name: "卷簧线材张力波动",
        area: "卷簧车间",
        impact: "medium" as const,
        owner: "生产部 / 李班长",
        due: "今日 16:00",
        status: "待确认",
      },
      {
        name: "一次合格率异常批次",
        area: "质检中心",
        impact: "medium" as const,
        owner: "质量部 / 张工",
        due: "今日 17:10",
        status: "复检中",
      },
      {
        name: "夜班出勤缺口",
        area: "总装/包装",
        impact: "high" as const,
        owner: "人资行政部 / 周主管",
        due: "今日 15:30",
        status: "已通知补位",
      },
      {
        name: "来料批次偏差",
        area: "采购/来料",
        impact: "low" as const,
        owner: "采购部 / 陈经理",
        due: "明日 10:00",
        status: "已登记",
      },
    ];

    const deptRank = [
      {
        name: "质量部",
        score: 91.2,
        delta: 1.6,
        tone: "ok" as const,
        redItems: 0,
      },
      {
        name: "销售部",
        score: 89.5,
        delta: 0.9,
        tone: "ok" as const,
        redItems: 0,
      },
      {
        name: "生产部",
        score: 85.1,
        delta: -1.4,
        tone: "watch" as const,
        redItems: 1,
      },
      {
        name: "仓储物流部",
        score: 83.6,
        delta: -0.8,
        tone: "watch" as const,
        redItems: 1,
      },
      {
        name: "设备部",
        score: 80.4,
        delta: -2.2,
        tone: "risk" as const,
        redItems: 2,
      },
      {
        name: "采购部",
        score: 79.8,
        delta: -1.9,
        tone: "risk" as const,
        redItems: 1,
      },
      {
        name: "人资行政部",
        score: 82.1,
        delta: -0.5,
        tone: "watch" as const,
        redItems: 1,
      },
    ];

    const deptMatrix = [
      {
        name: "销售部",
        score: 89.5,
        kpi: 93,
        riskStaff: 1,
        anomalies: 1,
      },
      {
        name: "生产部",
        score: 85.1,
        kpi: 88,
        riskStaff: 3,
        anomalies: 4,
      },
      {
        name: "质量部",
        score: 91.2,
        kpi: 95,
        riskStaff: 1,
        anomalies: 2,
      },
      {
        name: "设备部",
        score: 80.4,
        kpi: 83,
        riskStaff: 5,
        anomalies: 5,
      },
      {
        name: "采购部",
        score: 79.8,
        kpi: 81,
        riskStaff: 2,
        anomalies: 2,
      },
      {
        name: "仓储物流部",
        score: 83.6,
        kpi: 86,
        riskStaff: 2,
        anomalies: 3,
      },
      {
        name: "人资行政部",
        score: 82.1,
        kpi: 85,
        riskStaff: 4,
        anomalies: 2,
      },
    ];

    const topEmployees = [
      {
        name: "赵凯",
        dept: "质检中心",
        role: "高级检验员",
        score: 96,
        tag: "质量改善",
      },
      {
        name: "宋倩",
        dept: "压簧车间",
        role: "班组长",
        score: 94,
        tag: "高执行力",
      },
      {
        name: "高明",
        dept: "卷簧车间",
        role: "设备/工艺",
        score: 93,
        tag: "主动协作",
      },
      {
        name: "周婷",
        dept: "仓储物流部",
        role: "发运协调",
        score: 92,
        tag: "交付保障",
      },
      {
        name: "许磊",
        dept: "销售部",
        role: "客户经理",
        score: 91,
        tag: "客户运营",
      },
    ];

    const focusEmployees = [
      {
        name: "张三",
        dept: "热处理车间",
        reason: "夜班出勤不稳定，关键工序岗位缺口",
        action: "调整排班 + 关键岗位备援",
        status: "需跟进",
        level: "high" as const,
      },
      {
        name: "李强",
        dept: "设备部",
        reason: "设备停机响应时长偏高（近 7 日）",
        action: "现场响应 SLA 复盘 + 工单闭环",
        status: "复盘中",
        level: "medium" as const,
      },
      {
        name: "王敏",
        dept: "采购部",
        reason: "来料批次偏差沟通闭环慢",
        action: "供应商分级 + 到货偏差阈值升级",
        status: "观察",
        level: "low" as const,
      },
    ];

    const aiSummary = [
      "热处理车间 OEE 较昨日下降 8%，主要由炉 #3 停机与换型等待导致",
      "质检中心一次合格率提升 2.1%，复检工时占比下降",
      "包装出货组存在 3 单延期风险：夜班缺口 + 包装节拍波动",
      "夜班出勤偏低（-1.9%），明日产能可能下滑 3~5%",
      "销售部本周订单转化率高于上周，重点客户回购增加",
    ];

    const aiOpsBar =
      "AI 今日结论：整体经营平稳，热处理车间 OEE 下滑 8%，夜班出勤不足可能影响明日产能，建议优先关注设备停机与班组排班。";

    // 生产控制塔
    const productionKpis = {
      dailyPlan: 200_000,
      dailyActual: 186_500,
      monthPlan: 4_200_000,
      monthActual: 3_612_400,
      oee: 78.4,
      downtimeMin: 312,
      changeoverCount: 9,
      onTimePlan: 94.1,
      wipPcs: 421_000,
    };

    const equipmentStatus = [
      {
        name: "热处理炉 #3",
        workshop: "热处理车间",
        tone: "risk" as const,
        status: "停机 · 等待维修",
        oee: 0,
        runtime: "0h 00m",
        last: "E-214 温度超限 · 响应 SLA 突破 2h",
      },
      {
        name: "热处理炉 #1",
        workshop: "热处理车间",
        tone: "watch" as const,
        status: "降速运行",
        oee: 72,
        runtime: "8h 42m",
        last: "温控偏差 +3.2℃",
      },
      {
        name: "卷簧机 SP-08",
        workshop: "卷簧车间",
        tone: "ok" as const,
        status: "正常",
        oee: 88,
        runtime: "9h 10m",
        last: "张力稳定",
      },
      {
        name: "压簧机 CP-12",
        workshop: "压簧车间",
        tone: "ok" as const,
        status: "正常",
        oee: 91,
        runtime: "9h 05m",
        last: "运行良好",
      },
      {
        name: "包装线 PK-02",
        workshop: "包装出货组",
        tone: "watch" as const,
        status: "节拍波动",
        oee: 80,
        runtime: "8h 55m",
        last: "换型用时偏长 23%",
      },
      {
        name: "喷丸机 SB-01",
        workshop: "表面处理",
        tone: "ok" as const,
        status: "正常",
        oee: 85,
        runtime: "8h 40m",
        last: "运行良好",
      },
    ];

    const workOrders = [
      {
        id: "WO-260419-021",
        product: "卡车悬架弹簧 A-230",
        qty: 12_000,
        done: 82,
        due: "今日 18:00",
        stage: "热处理",
        risk: "watch" as const,
      },
      {
        id: "WO-260419-018",
        product: "精密压簧 PS-14",
        qty: 8_000,
        done: 56,
        due: "今日 20:00",
        stage: "卷簧 → 热处理",
        risk: "risk" as const,
      },
      {
        id: "WO-260418-004",
        product: "汽车阀门弹簧 V-12",
        qty: 15_000,
        done: 100,
        due: "昨日 20:00",
        stage: "已完工",
        risk: "ok" as const,
      },
      {
        id: "WO-260419-027",
        product: "通用扭簧 T-08",
        qty: 20_000,
        done: 34,
        due: "明日 12:00",
        stage: "卷簧",
        risk: "ok" as const,
      },
      {
        id: "WO-260419-030",
        product: "微型压簧 MP-03",
        qty: 5_000,
        done: 12,
        due: "明日 16:00",
        stage: "待开工",
        risk: "watch" as const,
      },
    ];

    const shiftBoard = [
      { team: "卷簧 A 班", leader: "王班长", staffing: "14/15", output: "28,400 pcs", pace: 102, tone: "ok" as const },
      { team: "热处理夜班", leader: "刘班长", staffing: "8/11", output: "19,200 pcs", pace: 81, tone: "risk" as const },
      { team: "压簧 B 班", leader: "陈班长", staffing: "12/12", output: "30,800 pcs", pace: 98, tone: "ok" as const },
      { team: "包装出货 C 班", leader: "赵班长", staffing: "9/10", output: "12,400 pcs", pace: 90, tone: "watch" as const },
    ];

    // 质量
    const qualityKpis = {
      fpy: 97.3,
      fpyDelta: 0.8,
      scrap: 0.84,
      scrapDelta: -0.12,
      rework: 1.96,
      reworkDelta: -0.3,
      cpk: 1.46,
      cpkDelta: 0.05,
      complaints: 2,
      complaintsDelta: -1,
      backlog: 18,
      backlogDelta: 4,
    };

    const qualityTrend = [
      { day: "周一", fpy: 96.2, scrap: 1.10 },
      { day: "周二", fpy: 96.6, scrap: 1.00 },
      { day: "周三", fpy: 96.9, scrap: 0.95 },
      { day: "周四", fpy: 96.8, scrap: 0.96 },
      { day: "周五", fpy: 97.1, scrap: 0.90 },
      { day: "周六", fpy: 97.2, scrap: 0.87 },
      { day: "周日", fpy: 97.3, scrap: 0.84 },
    ];

    const defectPareto = [
      { name: "尺寸偏差", count: 42, pct: 31.1 },
      { name: "硬度不合格", count: 21, pct: 15.6 },
      { name: "表面瑕疵", count: 28, pct: 20.7 },
      { name: "弹性偏离", count: 17, pct: 12.6 },
      { name: "外观/标识", count: 14, pct: 10.4 },
      { name: "其他", count: 13, pct: 9.6 },
    ];

    const ncrList = [
      {
        id: "NCR-260419-06",
        product: "热处理批次 HT-0419-C",
        issue: "硬度不合格 HRC-1.4",
        qty: 320,
        stage: "隔离 · 复检中",
        owner: "质量部 / 张工",
        level: "high" as const,
      },
      {
        id: "NCR-260419-04",
        product: "卷簧批次 SP-0419-B",
        issue: "外径超差 +0.08mm",
        qty: 180,
        stage: "8D 分析",
        owner: "质量部 / 周工",
        level: "medium" as const,
      },
      {
        id: "NCR-260418-12",
        product: "包装批次 PK-0418-A",
        issue: "标签错贴",
        qty: 56,
        stage: "已闭环",
        owner: "仓储 / 林工",
        level: "low" as const,
      },
    ];

    // 风险
    const riskOverview = { open: 14, high: 3, medium: 6, low: 5, closed7d: 22, slaBreach: 2 };

    const riskTimeline = [
      { day: "周一", high: 2, medium: 5, low: 4 },
      { day: "周二", high: 3, medium: 4, low: 4 },
      { day: "周三", high: 2, medium: 6, low: 3 },
      { day: "周四", high: 4, medium: 5, low: 5 },
      { day: "周五", high: 3, medium: 7, low: 4 },
      { day: "周六", high: 3, medium: 6, low: 5 },
      { day: "周日", high: 3, medium: 6, low: 5 },
    ];

    const riskCatalog = [
      { area: "交付风险", count: 5, trend: -1, hint: "延期订单 3 单（热处理瓶颈 / 包装节拍）" },
      { area: "设备风险", count: 4, trend: 1, hint: "热处理炉 #3 停机，响应 SLA 突破 2h" },
      { area: "质量风险", count: 2, trend: 0, hint: "硬度 NCR 隔离中，Cpk 临界" },
      { area: "人员/班组风险", count: 2, trend: 0, hint: "夜班出勤 -1.9%，关键岗备援缺口" },
      { area: "供应链风险", count: 1, trend: 0, hint: "线材张力波动，供应商待反馈" },
    ];

    // 绩效
    const kpiRadar = [
      { name: "财务达成", value: 92 },
      { name: "交付准时", value: 94 },
      { name: "质量指标", value: 96 },
      { name: "成本控制", value: 83 },
      { name: "安全合规", value: 89 },
      { name: "人才发展", value: 78 },
    ];

    const bonusPool = {
      monthly: 1_280_000,
      distributed: 940_000,
      top10: 312_000,
      riskLocked: 128_000,
    };

    return {
      weekTrend,
      workshopPerf,
      kpis,
      orderRisk,
      anomalies,
      deptRank,
      deptMatrix,
      topEmployees,
      focusEmployees,
      aiSummary,
      aiOpsBar,
      productionKpis,
      equipmentStatus,
      workOrders,
      shiftBoard,
      qualityKpis,
      qualityTrend,
      defectPareto,
      ncrList,
      riskOverview,
      riskTimeline,
      riskCatalog,
      kpiRadar,
      bonusPool,
    };
  }, []);

  const navItems = useMemo(
    () => [
      { key: "overview", label: "总览" },
      { key: "production", label: "生产" },
      { key: "quality", label: "质量" },
      { key: "performance", label: "绩效" },
      { key: "risk", label: "风险中心" },
      { key: "ai", label: "AI 助手" },
    ] as const,
    [],
  );

  const factories = useMemo(
    () => [
      { label: "双第弹簧一厂", value: "sd-1" },
      { label: "双第弹簧二厂（试运行）", value: "sd-2" },
      { label: "苏州协同工厂（外协）", value: "sz-coop" },
    ],
    [],
  );

  const headerDate = useMemo(() => {
    const date = now.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
    });
    const time = now.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return `${date}  ${time}`;
  }, [now]);

  const kpiCards = useMemo(
    () => [
      {
        name: "今日订单额",
        value: formatCNY(mock.kpis.orderAmount.value),
        delta: mock.kpis.orderAmount.delta,
        tone: mock.kpis.orderAmount.tone,
        spark: [2.7, 2.9, 3.1, 3.0, 3.2, 3.35, 3.48],
        hint: "重点客户回购拉动，高毛利压簧订单占比提升",
      },
      {
        name: "当日产量",
        value: `${mock.kpis.dailyOutput.value.toLocaleString("zh-CN")} pcs`,
        delta: mock.kpis.dailyOutput.delta,
        tone: mock.kpis.dailyOutput.tone,
        spark: [188, 191, 190, 189, 187, 186.8, 186.5],
        hint: "夜班出勤缺口 + 热处理节拍波动",
      },
      {
        name: "一次合格率",
        value: formatPct(mock.kpis.firstPassYield.value, 1),
        delta: mock.kpis.firstPassYield.delta,
        tone: mock.kpis.firstPassYield.tone,
        spark: [96.4, 96.8, 96.9, 97.0, 97.1, 97.2, 97.3],
        hint: "复检工时下降，关键尺寸 SPC 稳定",
      },
      {
        name: "准时交付率",
        value: formatPct(mock.kpis.onTimeDelivery.value, 1),
        delta: mock.kpis.onTimeDelivery.delta,
        tone: mock.kpis.onTimeDelivery.tone,
        spark: [96.8, 96.6, 96.4, 96.3, 96.2, 96.2, 96.1],
        hint: "延期风险集中在热处理与包装出货节拍",
      },
      {
        name: "设备 OEE",
        value: formatPct(mock.kpis.oee.value, 1),
        delta: mock.kpis.oee.delta,
        tone: mock.kpis.oee.tone,
        spark: [82.2, 81.4, 80.8, 79.6, 79.0, 78.8, 78.4],
        hint: "热处理炉 #3 停机，建议优先恢复瓶颈工序",
      },
      {
        name: "出勤率",
        value: formatPct(mock.kpis.attendance.value, 1),
        delta: mock.kpis.attendance.delta,
        tone: mock.kpis.attendance.tone,
        spark: [95.0, 94.6, 94.3, 94.0, 93.8, 93.5, 93.2],
        hint: "夜班缺口影响热处理与包装，需补位",
      },
    ],
    [mock],
  );

  const aiPrompts = useMemo(
    () => [
      "为什么今天热处理车间掉产？",
      "哪个部门本周风险最高？",
      "帮我生成今天的经营简报",
      "查看张三本月绩效详情",
    ],
    [],
  );

  const aiAnswer = useMemo(() => {
    const prompt = aiSelectedPrompt ?? "帮我生成今天的经营简报";
    if (prompt.includes("热处理")) {
      return [
        "结论：热处理为当日瓶颈工序，OEE 下滑 8% 直接造成在制品积压与节拍下降。",
        "1) 设备：热处理炉 #3 停机（预计 18:30 前恢复），导致可用产能减少约 12%。",
        "2) 过程：换型等待时间偏高（班组交接未严格执行标准化换型清单）。",
        "3) 人员：夜班关键岗位缺口，开机/巡检响应延迟。",
        "建议动作：优先恢复炉 #3；启用备援炉排产；对夜班补位并启用 Hermes + OpenClaw 加密巡检，关注停机原因闭环与换型等待。",
      ].join("\n");
    }
    if (prompt.includes("部门")) {
      return [
        "本周风险最高：设备部（综合分 80.4 / 红灯项 2）。",
        "关键风险：停机响应时长偏高 + 工单闭环超时。",
        "关联影响：热处理车间 OEE 下滑、交付风险订单增加。",
        "建议：按设备关键度分级 SLA；对热处理/卷簧关键设备开启“超时自动升级”与巡检频次提升。",
      ].join("\n");
    }
    if (prompt.includes("张三")) {
      return [
        "员工画像：张三 / 热处理车间 / 夜班关键岗位。",
        "本月绩效风险：出勤稳定性波动（近 14 天缺勤 2 次），造成班组关键工序交接断点。",
        "对经营影响：热处理节拍与 OEE 直接相关，风险会放大到交付与在制品周转。",
        "建议动作：1) 调整排班与备援；2) 对关键岗位实行到岗确认；3) 将换型交接纳入绩效闭环。",
      ].join("\n");
    }
    return [
      "SpringOps AI 今日经营简报（DeepSeek 分析 / Hermes·OpenClaw 巡检）：",
      `- 订单：今日订单额 ${formatCNY(mock.kpis.orderAmount.value)}，结构偏高毛利；客户回购拉动明显。`,
      `- 生产：当日产量 ${mock.kpis.dailyOutput.value.toLocaleString("zh-CN")} pcs，夜班缺口导致节拍偏弱。`,
      `- 质量：一次合格率 ${formatPct(mock.kpis.firstPassYield.value)}，较昨日改善；复检工时下降。`,
      `- 设备：OEE ${formatPct(mock.kpis.oee.value)}，热处理炉 #3 停机为主要拖累。`,
      `- 风险：延期风险订单 ${mock.orderRisk.length} 单，建议优先处理热处理瓶颈与包装节拍。`,
      "建议：当日以“瓶颈工序恢复 + 夜班补位 + 异常闭环提速”为第一优先级。",
    ].join("\n");
  }, [aiSelectedPrompt, mock]);

  // ---------- 子页面复用的小组件 ----------
  const PageHero = ({
    eyebrow,
    title,
    desc,
    tagTone = "ok",
    tagText,
    actions,
  }: {
    eyebrow: string;
    title: string;
    desc: string;
    tagTone?: StatusTone;
    tagText?: string;
    actions?: React.ReactNode;
  }) => (
    <div className="rounded-2xl border border-zinc-200/70 bg-gradient-to-br from-white to-sky-50/40 p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-500">{eyebrow}</span>
            {tagText ? <Badge tone={tagTone}>{tagText}</Badge> : null}
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            {title}
          </div>
          <div className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
            {desc}
          </div>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );

  const Tile = ({
    label,
    value,
    sub,
    tone = "ok",
    hint,
  }: {
    label: string;
    value: React.ReactNode;
    sub?: React.ReactNode;
    tone?: StatusTone;
    hint?: string;
  }) => (
    <Card>
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-medium text-zinc-500">{label}</div>
            <div className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
              {value}
            </div>
            {sub ? <div className="mt-1 text-xs text-zinc-500">{sub}</div> : null}
          </div>
          <Badge tone={tone}>
            {tone === "ok" ? "达成" : tone === "watch" ? "关注" : "风险"}
          </Badge>
        </div>
        {hint ? (
          <div className="mt-3 text-xs leading-5 text-zinc-500">
            <span className="opacity-70">提示：</span>
            {hint}
          </div>
        ) : null}
      </div>
    </Card>
  );

  const ProgressBar = ({
    value,
    tone = "ok",
  }: {
    value: number;
    tone?: StatusTone;
  }) => {
    const color =
      tone === "ok"
        ? "bg-emerald-500"
        : tone === "watch"
          ? "bg-amber-500"
          : "bg-rose-500";
    const clamped = Math.max(0, Math.min(100, value));
    return (
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${clamped}%` }}
        />
      </div>
    );
  };

  // ---------- 生产控制塔 ----------
  const renderProduction = () => {
    const p = mock.productionKpis;
    const dayRate = (p.dailyActual / p.dailyPlan) * 100;
    const monthRate = (p.monthActual / p.monthPlan) * 100;
    return (
      <>
        <PageHero
          eyebrow="生产控制塔 · Production"
          title="车间排产 · 在制 · OEE · 瓶颈闭环"
          desc="实时跟踪日产量达成、关键设备 OEE、工单进度与班组节拍，辅助瓶颈工序的快速决策。"
          tagTone="watch"
          tagText="热处理瓶颈"
          actions={
            <>
              <Button variant="default" onClick={onAi}>
                <span className="inline-flex items-center gap-2">
                  <Icon name="bot" />
                  诊断瓶颈工序
                </span>
              </Button>
              <Button variant="outline">一键下发排产调整</Button>
            </>
          }
        />

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Tile
            label="日产量达成率"
            value={formatPct(dayRate)}
            sub={`${p.dailyActual.toLocaleString("zh-CN")} / ${p.dailyPlan.toLocaleString("zh-CN")} pcs`}
            tone={dayRate >= 98 ? "ok" : dayRate >= 92 ? "watch" : "risk"}
            hint="夜班节拍偏弱，缺口集中在热处理"
          />
          <Tile
            label="月度累计达成"
            value={formatPct(monthRate)}
            sub={`${(p.monthActual / 10_000).toFixed(1)} 万 / ${(p.monthPlan / 10_000).toFixed(0)} 万 pcs`}
            tone={monthRate >= 90 ? "ok" : monthRate >= 85 ? "watch" : "risk"}
            hint="本周五、六节拍下降带来进度回撤"
          />
          <Tile
            label="设备综合 OEE"
            value={formatPct(p.oee)}
            sub={`停机 ${p.downtimeMin} 分钟 · 换型 ${p.changeoverCount} 次`}
            tone="risk"
            hint="热处理炉 #3 停机，建议启用备援炉"
          />
          <Tile
            label="在制 WIP"
            value={`${(p.wipPcs / 10_000).toFixed(1)} 万 pcs`}
            sub={`计划准时率 ${formatPct(p.onTimePlan)}`}
            tone="watch"
            hint="热处理前缓冲区偏高，关注翻转时效"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-7">
            <CardHeader
              title="各车间绩效与 OEE"
              description="绩效分（0~100）与设备 OEE（%）联动对比"
              right={<Badge tone="watch">热处理偏弱</Badge>}
            />
            <CardBody className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mock.workshopPerf} margin={{ left: 6, right: 6 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(24,24,27,0.08)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#71717a" }} interval={0} height={60} angle={-18} textAnchor="end" />
                  <YAxis tick={{ fontSize: 12, fill: "#71717a" }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(228,228,231,1)", boxShadow: "0 8px 30px rgba(24,24,27,0.08)" }} />
                  <Bar dataKey="score" fill="rgba(2,132,199,0.9)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="oee" fill="rgba(16,185,129,0.85)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          <Card className="lg:col-span-5">
            <CardHeader
              title="关键设备实时状态"
              description="基于 Hermes/OpenClaw 巡检数据（演示）"
              right={<Badge tone="risk">1 台停机</Badge>}
            />
            <CardBody className="space-y-2">
              {mock.equipmentStatus.map((e) => (
                <div
                  key={e.name}
                  className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200/70 bg-white px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "h-2 w-2 rounded-full",
                        e.tone === "ok" ? "bg-emerald-500" : e.tone === "watch" ? "bg-amber-500" : "bg-rose-500",
                      )} />
                      <div className="truncate text-sm font-semibold text-zinc-900">{e.name}</div>
                      <Badge tone={e.tone}>{e.status}</Badge>
                    </div>
                    <div className="mt-1 truncate text-xs text-zinc-500">
                      {e.workshop} · 运行 {e.runtime} · {e.last}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-xs text-zinc-500">OEE</div>
                    <div className="text-sm font-semibold text-zinc-900">{e.oee}%</div>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-8">
            <CardHeader
              title="今日工单执行进度"
              description="卷簧 · 热处理 · 压簧 · 包装 全流程在制追踪"
              right={<Badge tone="watch">2 单风险</Badge>}
            />
            <CardBody className="space-y-3">
              {mock.workOrders.map((w) => (
                <div key={w.id} className="rounded-xl border border-zinc-200/70 bg-white px-4 py-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-zinc-900">{w.id}</span>
                        <RiskBadge level={w.risk === "ok" ? "low" : w.risk === "watch" ? "medium" : "high"} />
                        <span className="inline-flex items-center rounded-md bg-zinc-50 px-2 py-0.5 text-xs text-zinc-700 ring-1 ring-inset ring-zinc-200/60">
                          {w.stage}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">
                        {w.product} · 数量 {w.qty.toLocaleString("zh-CN")} · 截止 {w.due}
                      </div>
                    </div>
                    <div className="min-w-[180px]">
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <span>进度</span>
                        <span className="font-medium text-zinc-900">{w.done}%</span>
                      </div>
                      <div className="mt-1">
                        <ProgressBar value={w.done} tone={w.risk} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card className="lg:col-span-4">
            <CardHeader
              title="班组实时看板"
              description="出勤 / 产出 / 节拍达成"
              right={<Badge tone="watch">夜班缺口</Badge>}
            />
            <CardBody className="space-y-3">
              {mock.shiftBoard.map((s) => (
                <div key={s.team} className="rounded-xl border border-zinc-200/70 bg-white px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-zinc-900">{s.team}</span>
                        <Badge tone={s.tone}>{s.pace}% 节拍</Badge>
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">
                        {s.leader} · 出勤 {s.staffing}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-zinc-500">产出</div>
                      <div className="text-sm font-semibold text-zinc-900">{s.output}</div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <ProgressBar value={s.pace} tone={s.tone} />
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </>
    );

    function onAi() { setAiOpen(true); }
  };

  // ---------- 质量中心 ----------
  const renderQuality = () => {
    const q = mock.qualityKpis;
    return (
      <>
        <PageHero
          eyebrow="质量管控中心 · Quality"
          title="SPC · FPY · NCR · 8D 闭环"
          desc="以一次合格率与过程能力为主线，贯通来料、过程、成品与客户端反馈的质量闭环。"
          tagTone="ok"
          tagText="FPY 改善中"
          actions={
            <>
              <Button variant="default" onClick={() => setAiOpen(true)}>
                <span className="inline-flex items-center gap-2">
                  <Icon name="bot" />
                  分析不合格根因
                </span>
              </Button>
              <Button variant="outline">导出质量日报</Button>
            </>
          }
        />

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
          <Tile label="一次合格率 FPY" value={formatPct(q.fpy)} sub={`较昨日 ${q.fpyDelta > 0 ? "+" : ""}${q.fpyDelta}%`} tone="ok" />
          <Tile label="废品率" value={formatPct(q.scrap)} sub={`较昨日 ${q.scrapDelta}%`} tone="ok" />
          <Tile label="返工率" value={formatPct(q.rework)} sub={`较昨日 ${q.reworkDelta}%`} tone="watch" />
          <Tile label="过程能力 Cpk" value={q.cpk.toFixed(2)} sub={`+${q.cpkDelta.toFixed(2)}`} tone="ok" />
          <Tile label="客户投诉" value={`${q.complaints} 单`} sub={`较昨日 ${q.complaintsDelta} 单`} tone={q.complaints > 2 ? "watch" : "ok"} />
          <Tile label="待检批次积压" value={`${q.backlog} 批`} sub={`较昨日 +${q.backlogDelta} 批`} tone="watch" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-7">
            <CardHeader
              title="FPY / 废品率趋势"
              description="近 7 天一次合格率（%）与废品率（%）"
              right={<Badge tone="ok">改善</Badge>}
            />
            <CardBody className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mock.qualityTrend} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(24,24,27,0.08)" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#71717a" }} />
                  <YAxis yAxisId="left" domain={[95, 100]} tick={{ fontSize: 12, fill: "#71717a" }} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 2]} tick={{ fontSize: 12, fill: "#71717a" }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(228,228,231,1)" }} />
                  <Line yAxisId="left" type="monotone" dataKey="fpy" stroke="rgb(16 185 129)" strokeWidth={2.4} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="scrap" stroke="rgb(239 68 68)" strokeWidth={2.2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          <Card className="lg:col-span-5">
            <CardHeader
              title="缺陷 Pareto（本月）"
              description="按缺陷类别占比排序，指导改进优先级"
              right={<Badge tone="watch">聚焦 Top3</Badge>}
            />
            <CardBody className="space-y-3">
              {mock.defectPareto.map((d) => (
                <div key={d.name} className="rounded-xl border border-zinc-200/70 bg-white px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-zinc-900">{d.name}</div>
                    <div className="text-xs text-zinc-500">
                      {d.count} 次 · {d.pct}%
                    </div>
                  </div>
                  <div className="mt-2">
                    <ProgressBar value={d.pct * 3} tone={d.pct >= 20 ? "risk" : d.pct >= 12 ? "watch" : "ok"} />
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader
            title="不合格品 NCR 清单"
            description="隔离 → 原因分析 → 8D 闭环（支持飞书推送与责任链追溯）"
            right={<Badge tone="risk">高优先 1 单</Badge>}
          />
          <CardBody>
            <Table>
              <thead>
                <tr>
                  <Th>编号</Th>
                  <Th>批次 / 产品</Th>
                  <Th>问题描述</Th>
                  <Th>数量</Th>
                  <Th>处置阶段</Th>
                  <Th>责任人</Th>
                  <Th>等级</Th>
                </tr>
              </thead>
              <tbody>
                {mock.ncrList.map((n) => (
                  <tr key={n.id} className="cursor-pointer transition-colors hover:bg-sky-50/60" onClick={() => setAiOpen(true)}>
                    <Td className="font-medium text-zinc-900">{n.id}</Td>
                    <Td>{n.product}</Td>
                    <Td className="text-zinc-700">{n.issue}</Td>
                    <Td className="font-medium text-zinc-900">{n.qty} pcs</Td>
                    <Td>
                      <span className="inline-flex items-center rounded-md bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-zinc-200/60">
                        {n.stage}
                      </span>
                    </Td>
                    <Td>{n.owner}</Td>
                    <Td><RiskBadge level={n.level} /></Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs text-zinc-500">
                关联逻辑：NCR 未闭环超过 SLA 将自动升级并扣减责任部门绩效
              </div>
              <Button variant="secondary" onClick={() => setAiOpen(true)}>
                打开 8D 工作台
              </Button>
            </div>
          </CardBody>
        </Card>
      </>
    );
  };

  // ---------- 绩效中心 ----------
  const renderPerformance = () => {
    const b = mock.bonusPool;
    const distRate = (b.distributed / b.monthly) * 100;
    return (
      <>
        <PageHero
          eyebrow="绩效中心 · Performance"
          title="KPI 达成 · 部门排行 · 员工画像 · 奖金池"
          desc="联动 KPI、异常闭环、协同评分与出勤稳定性，输出可下钻的部门与员工绩效结论。"
          tagTone="ok"
          tagText="本月 B+"
          actions={
            <>
              <Button variant="default" onClick={() => { setAiSelectedPrompt("哪个部门本周风险最高？"); setAiOpen(true); }}>
                <span className="inline-flex items-center gap-2">
                  <Icon name="bot" />
                  AI 绩效分析
                </span>
              </Button>
              <Button variant="outline">导出月度绩效表</Button>
            </>
          }
        />

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Tile label="公司 KPI 综合达成" value="88.2 分" sub="目标 90 · 差距 -1.8" tone="watch" />
          <Tile label="月度奖金池" value={formatCNY(b.monthly)} sub={`已分配 ${formatPct(distRate)}`} tone="ok" />
          <Tile label="Top 10 员工奖金占比" value={formatPct((b.top10 / b.monthly) * 100)} sub={formatCNY(b.top10)} tone="ok" />
          <Tile label="风险冻结金额" value={formatCNY(b.riskLocked)} sub="待复核人员 4 人" tone="risk" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-6">
            <CardHeader
              title="KPI 六维达成雷达（简化）"
              description="财务 / 交付 / 质量 / 成本 / 安全 / 人才"
              right={<Badge tone="watch">成本/人才偏弱</Badge>}
            />
            <CardBody className="space-y-3">
              {mock.kpiRadar.map((k) => {
                const tone: StatusTone = k.value >= 90 ? "ok" : k.value >= 82 ? "watch" : "risk";
                return (
                  <div key={k.name} className="rounded-xl border border-zinc-200/70 bg-white px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-zinc-900">{k.name}</div>
                      <div className="text-sm font-semibold text-zinc-900">{k.value}</div>
                    </div>
                    <div className="mt-2"><ProgressBar value={k.value} tone={tone} /></div>
                  </div>
                );
              })}
            </CardBody>
          </Card>

          <Card className="lg:col-span-6">
            <CardHeader
              title="部门综合评分排行榜"
              description="本月绩效分 / 上月对比 / 红灯项（可下钻）"
              right={<Badge tone="watch">可下钻</Badge>}
            />
            <CardBody className="space-y-3">
              {mock.deptRank.map((d) => (
                <button
                  key={d.name}
                  type="button"
                  className="w-full rounded-xl border border-zinc-200/70 bg-white px-4 py-3 text-left shadow-sm transition-colors hover:bg-sky-50/40"
                  onClick={() => setAiOpen(true)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-zinc-900">{d.name}</div>
                        <Badge tone={d.tone}>
                          {d.tone === "ok" ? "稳定" : d.tone === "watch" ? "关注" : "风险"}
                        </Badge>
                        {d.redItems > 0 ? (
                          <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-200">
                            红灯 {d.redItems}
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">
                        KPI / 异常 / 人员 / 设备综合评分
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-semibold tracking-tight text-zinc-900">
                        {d.score.toFixed(1)}
                      </div>
                      <div className="mt-1"><Delta value={d.delta} /></div>
                    </div>
                  </div>
                </button>
              ))}
            </CardBody>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-6">
            <CardHeader title="优秀员工 TOP 5" description="支持下钻到员工考核详情" right={<Badge tone="ok">标杆</Badge>} />
            <CardBody className="space-y-3">
              {mock.topEmployees.map((e) => (
                <div key={e.name} className="flex flex-col justify-between gap-3 rounded-xl border border-zinc-200/70 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold text-zinc-900">{e.name}</div>
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                        {e.tag}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">{e.dept} · {e.role}</div>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <div className="text-right">
                      <div className="text-xs text-zinc-500">绩效分</div>
                      <div className="text-lg font-semibold text-zinc-900">{e.score}</div>
                    </div>
                    <Button variant="outline" onClick={() => setAiOpen(true)}>查看考核详情</Button>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card className="lg:col-span-6">
            <CardHeader title="重点关注员工" description="风险原因与建议动作（支持下钻到排班与闭环）" right={<Badge tone="watch">需跟进</Badge>} />
            <CardBody className="space-y-3">
              {mock.focusEmployees.map((e) => (
                <div key={e.name} className="rounded-xl border border-zinc-200/70 bg-white px-4 py-3 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-sm font-semibold text-zinc-900">{e.name}</div>
                        <span className="text-xs text-zinc-500">{e.dept}</span>
                        <RiskBadge level={e.level} />
                        <span className="inline-flex items-center rounded-md bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-zinc-200/60">
                          {e.status}
                        </span>
                      </div>
                      <div className="mt-2 text-xs leading-5 text-zinc-600">
                        <span className="font-medium text-zinc-700">风险原因：</span>{e.reason}
                      </div>
                      <div className="mt-2 text-xs leading-5 text-zinc-600">
                        <span className="font-medium text-zinc-700">建议动作：</span>{e.action}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Button variant="outline" onClick={() => { setAiSelectedPrompt("查看张三本月绩效详情"); setAiOpen(true); }}>
                        考核详情
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </>
    );
  };

  // ---------- 风险中心 ----------
  const renderRisk = () => {
    const r = mock.riskOverview;
    return (
      <>
        <PageHero
          eyebrow="风险中心 · Risk"
          title="交付 / 设备 / 质量 / 人员 / 供应链 · 风险聚合视图"
          desc="基于巡检、异常闭环与 SLA 规则的全局风险看板，支持一键升级与责任链追溯。"
          tagTone="risk"
          tagText={`未闭环 ${r.open} 项`}
          actions={
            <>
              <Button variant="default" onClick={() => setAiOpen(true)}>
                <span className="inline-flex items-center gap-2">
                  <Icon name="bot" />
                  生成风险简报
                </span>
              </Button>
              <Button variant="outline">导出责任链清单</Button>
            </>
          }
        />

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
          <Tile label="未闭环风险" value={`${r.open} 项`} tone="risk" />
          <Tile label="高风险" value={`${r.high} 项`} tone="risk" />
          <Tile label="中风险" value={`${r.medium} 项`} tone="watch" />
          <Tile label="低风险" value={`${r.low} 项`} tone="ok" />
          <Tile label="近 7 日闭环" value={`${r.closed7d} 项`} tone="ok" />
          <Tile label="SLA 超时" value={`${r.slaBreach} 项`} tone="risk" hint="自动升级为红色预警" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-7">
            <CardHeader
              title="风险趋势（近 7 天）"
              description="按等级分布堆叠"
              right={<Badge tone="watch">高风险抬头</Badge>}
            />
            <CardBody className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mock.riskTimeline} margin={{ left: 6, right: 6 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(24,24,27,0.08)" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#71717a" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#71717a" }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(228,228,231,1)" }} />
                  <Bar dataKey="high" stackId="a" fill="rgba(239,68,68,0.85)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="medium" stackId="a" fill="rgba(245,158,11,0.85)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="low" stackId="a" fill="rgba(16,185,129,0.85)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          <Card className="lg:col-span-5">
            <CardHeader title="风险类别分布" description="按业务域聚合" right={<Badge tone="watch">5 类</Badge>} />
            <CardBody className="space-y-3">
              {mock.riskCatalog.map((c) => {
                const tone: StatusTone = c.count >= 4 ? "risk" : c.count >= 2 ? "watch" : "ok";
                return (
                  <div key={c.area} className="rounded-xl border border-zinc-200/70 bg-white px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-zinc-900">{c.area}</span>
                          <Badge tone={tone}>{c.count} 项</Badge>
                          {c.trend !== 0 ? (
                            <span className={cn(
                              "text-xs font-medium",
                              c.trend > 0 ? "text-rose-700" : "text-emerald-700",
                            )}>
                              {c.trend > 0 ? "↑" : "↓"}{Math.abs(c.trend)}
                            </span>
                          ) : (
                            <span className="text-xs text-zinc-400">—</span>
                          )}
                        </div>
                        <div className="mt-1 text-xs text-zinc-500">{c.hint}</div>
                      </div>
                      <Button variant="outline" onClick={() => setAiOpen(true)}>详情</Button>
                    </div>
                  </div>
                );
              })}
            </CardBody>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-7">
            <CardHeader title="延期风险订单" description="按交付影响排序" right={<Badge tone="risk">重点关注</Badge>} />
            <CardBody>
              <Table>
                <thead>
                  <tr>
                    <Th>订单号</Th><Th>客户</Th><Th>风险类型</Th><Th>预计延期</Th><Th>责任部门</Th><Th>状态</Th>
                  </tr>
                </thead>
                <tbody>
                  {mock.orderRisk.map((r2) => (
                    <tr key={r2.id} className="cursor-pointer transition-colors hover:bg-sky-50/60" onClick={() => setAiOpen(true)}>
                      <Td>
                        <div className="flex items-center gap-2">
                          <RiskBadge level={r2.level} />
                          <span className="font-medium text-zinc-900">{r2.id}</span>
                        </div>
                      </Td>
                      <Td>{r2.customer}</Td>
                      <Td className="text-zinc-700">{r2.type}</Td>
                      <Td className="font-medium text-zinc-900">{r2.delayDays} 天</Td>
                      <Td>{r2.owner}</Td>
                      <Td>
                        <span className="inline-flex items-center rounded-md bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-zinc-200/60">
                          {r2.status}
                        </span>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>

          <Card className="lg:col-span-5">
            <CardHeader title="今日异常闭环" description="责任人 / 截止 / 状态" right={<Badge tone="watch">闭环中</Badge>} />
            <CardBody className="space-y-2">
              {mock.anomalies.map((a) => (
                <div key={a.name} className="rounded-xl border border-zinc-200/70 bg-white px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-zinc-900">{a.name}</span>
                        <RiskBadge level={a.impact} />
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">
                        {a.area} · {a.owner} · 截止 {a.due}
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-md bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-zinc-200/60">
                      {a.status}
                    </span>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </>
    );
  };

  // ---------- AI 工作台 ----------
  const renderAi = () => (
    <>
      <PageHero
        eyebrow="AI 助手 · SpringOps Copilot"
        title="经营 / 生产 / 质量 / 绩效 一体化分析"
        desc="基于 DeepSeek 模型与 Hermes·OpenClaw 巡检 Agent，输出结论—依据—影响—建议动作的管理风格回答。"
        tagTone="ok"
        tagText="DeepSeek 在线"
        actions={
          <>
            <Button variant="default" onClick={() => setAiOpen(true)}>
              <span className="inline-flex items-center gap-2">
                <Icon name="bot" />
                打开对话抽屉
              </span>
            </Button>
            <Button variant="outline" onClick={() => { setAiSelectedPrompt(null); setAiOpen(true); }}>
              生成今日经营简报
            </Button>
          </>
        }
      />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-4">
          <CardHeader title="快捷提问" description="点击即生成管理分析结论" />
          <CardBody className="space-y-2">
            {aiPrompts.map((p) => (
              <Button
                key={p}
                variant={aiSelectedPrompt === p ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => { setAiSelectedPrompt(p); setAiOpen(true); }}
              >
                {p}
              </Button>
            ))}
            <div className="pt-2 text-xs text-zinc-500">
              输入源：飞书工单 · 巡检事件 · 绩效规则引擎 · MES / ERP 快照
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-8">
          <CardHeader
            title="当前分析结论"
            description="结论—依据—影响—建议动作"
            right={<Badge tone="ok">DeepSeek</Badge>}
          />
          <CardBody>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-6 text-zinc-800">
              <pre className="whitespace-pre-wrap font-sans">{aiAnswer}</pre>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => setAiOpen(true)}>查看巡检证据链</Button>
              <Button variant="outline" onClick={() => setAiOpen(true)}>推送飞书群</Button>
              <Button variant="outline" onClick={() => setAiOpen(true)}>创建跟进工单</Button>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardHeader title="AI 经营摘要（今日）" description="巡检与规则引擎联合产出" right={<Badge tone="watch">7 条预警</Badge>} />
          <CardBody className="space-y-2">
            {mock.aiSummary.map((t, idx) => (
              <div key={idx} className="rounded-lg bg-zinc-50 px-3 py-2 text-sm leading-6 text-zinc-700 ring-1 ring-inset ring-zinc-200/60">
                {t}
              </div>
            ))}
          </CardBody>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader title="工具动作（演示）" description="推送飞书 / 创建工单 / 升级预警" />
          <CardBody className="space-y-2">
            <Button variant="outline" className="w-full justify-start">推送“热处理炉 #3 停机”诊断到飞书群</Button>
            <Button variant="outline" className="w-full justify-start">为“夜班缺口”创建排班协同工单</Button>
            <Button variant="outline" className="w-full justify-start">将延期风险订单升级为红色预警</Button>
            <Button variant="outline" className="w-full justify-start">把今日结论归档到经营月报</Button>
            <div className="pt-2 text-xs text-zinc-500">
              说明：真实产品中这些动作将通过飞书开放平台 + 规则引擎执行，保留审计轨迹。
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white text-zinc-900">
      <div className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-600 to-sky-400 shadow-sm shadow-sky-500/20">
              <div className="h-4 w-4 rounded-sm bg-white/90" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">
                SpringOps AI
              </div>
              <div className="text-[11px] text-zinc-500">
                Spring Manufacturing Intelligence Platform
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const active = activeNav === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setActiveNav(item.key);
                  }}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-700 hover:bg-zinc-100",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden text-xs text-zinc-500 lg:block">
              {headerDate}
            </div>

            <Select value={factory} onChange={setFactory} options={factories} />

            <Button variant="outline" title="通知">
              <span className="inline-flex items-center gap-2">
                <Icon name="bell" />
                <span className="hidden sm:inline">通知</span>
                <span className="ml-1 inline-flex h-5 items-center rounded-full bg-rose-50 px-2 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-200">
                  3
                </span>
              </span>
            </Button>

            <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-2 py-1 shadow-sm">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-zinc-900 to-zinc-600" />
              <div className="hidden pr-2 text-xs font-medium text-zinc-700 sm:block">
                Mark / GM
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1400px] px-6 pb-16 pt-8">
        {activeNav === "overview" && (
        <>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-zinc-200/70 bg-gradient-to-br from-white to-sky-50/40 p-6 shadow-sm">
              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-xs font-medium text-zinc-500">
                    企业级智能制造经营与绩效驾驶舱
                  </div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                    企业经营驾驶舱
                  </div>
                  <div className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                    实时掌握订单、生产、质量、设备与员工绩效运行状态
                  </div>
                </div>

                <div className="rounded-xl border border-sky-200/60 bg-white/60 px-4 py-3 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200">
                      <Icon name="spark" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-zinc-900">
                        AI 今日结论
                      </div>
                      <div className="mt-1 text-sm leading-6 text-zinc-700">
                        {mock.aiOpsBar}
                      </div>
                      <div className="mt-2 text-xs text-zinc-500">
                        数据入口：飞书协同 · 规则引擎：绩效/异常闭环 · 分析模型：DeepSeek · 巡检 Agent：Hermes / OpenClaw
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="default"
                    size="md"
                    onClick={() => setAiOpen(true)}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Icon name="bot" />
                      打开 AI 助手
                    </span>
                  </Button>
                  <Button variant="outline" size="md">
                    查看今日工单
                  </Button>
                  <Button variant="outline" size="md">
                    进入风险中心
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <Card className="h-full">
              <CardHeader
                title="AI 智能巡检状态"
                description="Hermes / OpenClaw 持续巡检关键设备、异常与绩效信号"
                right={
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-30" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    </span>
                    <span className="text-xs font-medium text-emerald-700">
                      运行中
                    </span>
                  </div>
                }
              />
              <CardBody className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-zinc-50 px-3 py-2 ring-1 ring-inset ring-zinc-200/70">
                    <div className="text-xs text-zinc-500">最近巡检</div>
                    <div className="mt-1 text-sm font-semibold text-zinc-900">
                      2 分钟前
                    </div>
                  </div>
                  <div className="rounded-lg bg-zinc-50 px-3 py-2 ring-1 ring-inset ring-zinc-200/70">
                    <div className="text-xs text-zinc-500">今日分析任务</div>
                    <div className="mt-1 text-sm font-semibold text-zinc-900">
                      128
                    </div>
                  </div>
                  <div className="rounded-lg bg-zinc-50 px-3 py-2 ring-1 ring-inset ring-zinc-200/70">
                    <div className="text-xs text-zinc-500">已触发预警</div>
                    <div className="mt-1 text-sm font-semibold text-rose-700">
                      7
                    </div>
                  </div>
                  <div className="rounded-lg bg-zinc-50 px-3 py-2 ring-1 ring-inset ring-zinc-200/70">
                    <div className="text-xs text-zinc-500">AI Model</div>
                    <div className="mt-1 text-sm font-semibold text-zinc-900">
                      DeepSeek
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200/70 bg-white px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-zinc-500">Active Agent</div>
                      <div className="mt-1 text-sm font-semibold text-zinc-900">
                        Hermes / OpenClaw
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => setAiOpen(true)}
                    >
                      查看详情
                    </Button>
                  </div>
                </div>

                <div className="text-xs leading-5 text-zinc-500">
                  当前工厂：
                  <span className="font-medium text-zinc-700">
                    {factories.find((f) => f.value === factory)?.label}
                  </span>
                  <span className="mx-2 text-zinc-300">|</span>
                  巡检关注：停机原因闭环、热处理瓶颈、夜班出勤、延期风险订单
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
          {kpiCards.map((k) => (
            <KpiCard key={k.name} {...k} />
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-5">
            <CardHeader
              title="本周订单与产量趋势"
              description="近 7 天订单量（单）与产量（万 pcs）对比"
              right={<Badge tone="ok">趋势稳定</Badge>}
            />
            <CardBody className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mock.weekTrend} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(24,24,27,0.08)" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#71717a" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#71717a" }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid rgba(228,228,231,1)",
                      boxShadow: "0 8px 30px rgba(24,24,27,0.08)",
                    }}
                    formatter={(v: unknown, key: unknown) => {
                      const k = String(key);
                      if (k === "orders") return [`${v} 单`, "订单量"];
                      return [`${v} 万 pcs`, "产量"];
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="rgb(2 132 199)"
                    strokeWidth={2.4}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="output"
                    stroke="rgb(16 185 129)"
                    strokeWidth={2.2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          <Card className="lg:col-span-4">
            <CardHeader
              title="各车间绩效对比"
              description="绩效分（0~100）与设备 OEE（%）综合对比"
              right={<Badge tone="watch">热处理偏弱</Badge>}
            />
            <CardBody className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mock.workshopPerf} margin={{ left: 6, right: 6 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(24,24,27,0.08)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#71717a" }}
                    interval={0}
                    height={60}
                    angle={-18}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 12, fill: "#71717a" }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid rgba(228,228,231,1)",
                      boxShadow: "0 8px 30px rgba(24,24,27,0.08)",
                    }}
                    formatter={(v: unknown, key: unknown) => {
                      const k = String(key);
                      if (k === "score") return [`${v} 分`, "绩效分"];
                      return [`${v}%`, "OEE"];
                    }}
                  />
                  <Bar dataKey="score" fill="rgba(2,132,199,0.9)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="oee" fill="rgba(16,185,129,0.85)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader
              title="AI 经营摘要"
              description="DeepSeek 分析 + Hermes/OpenClaw 巡检信号汇总"
              right={<Badge tone="watch">7 条预警</Badge>}
            />
            <CardBody className="space-y-3">
              <div className="space-y-2">
                {mock.aiSummary.slice(0, 5).map((t, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg bg-zinc-50 px-3 py-2 text-sm leading-6 text-zinc-700 ring-1 ring-inset ring-zinc-200/60"
                  >
                    {t}
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setAiOpen(true)}
              >
                查看 AI 诊断详情
              </Button>
              <div className="text-xs text-zinc-500">
                下钻提示：点击“热处理车间”或“延期风险订单”可进入专题诊断
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-6">
            <CardHeader
              title="延期风险订单"
              description="交付风险清单（已按影响排序）"
              right={<Badge tone="risk">重点关注</Badge>}
            />
            <CardBody className="space-y-4">
              <Table>
                <thead>
                  <tr>
                    <Th>订单号</Th>
                    <Th>客户</Th>
                    <Th>风险类型</Th>
                    <Th>预计延期</Th>
                    <Th>责任部门</Th>
                    <Th>状态</Th>
                  </tr>
                </thead>
                <tbody>
                  {mock.orderRisk.map((r) => (
                    <tr
                      key={r.id}
                      className="cursor-pointer transition-colors hover:bg-sky-50/60"
                      title="点击可下钻进入订单风险诊断"
                      onClick={() => setAiOpen(true)}
                    >
                      <Td>
                        <div className="flex items-center gap-2">
                          <RiskBadge level={r.level} />
                          <span className="font-medium text-zinc-900">{r.id}</span>
                        </div>
                      </Td>
                      <Td>{r.customer}</Td>
                      <Td className="text-zinc-700">{r.type}</Td>
                      <Td className="font-medium text-zinc-900">{r.delayDays} 天</Td>
                      <Td>{r.owner}</Td>
                      <Td>
                        <span className="inline-flex items-center rounded-md bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-zinc-200/60">
                          {r.status}
                        </span>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="flex items-center justify-between">
                <div className="text-xs text-zinc-500">
                  与设备 OEE/出勤率联动：当瓶颈工序 OEE 下滑时，风险订单自动升级
                </div>
                <Button variant="secondary" onClick={() => setAiOpen(true)}>
                  进入风险中心
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card className="lg:col-span-6">
            <CardHeader
              title="今日异常 TOP 5"
              description="异常闭环中心（影响等级 / 负责人 / 截止时间）"
              right={<Badge tone="watch">闭环中</Badge>}
            />
            <CardBody className="space-y-4">
              <Table>
                <thead>
                  <tr>
                    <Th>异常名称</Th>
                    <Th>发生区域</Th>
                    <Th>影响等级</Th>
                    <Th>当前负责人</Th>
                    <Th>截止时间</Th>
                    <Th>处理状态</Th>
                  </tr>
                </thead>
                <tbody>
                  {mock.anomalies.map((a) => (
                    <tr
                      key={a.name}
                      className="cursor-pointer transition-colors hover:bg-zinc-50"
                      title="点击可下钻进入异常闭环详情"
                      onClick={() => setAiOpen(true)}
                    >
                      <Td className="font-medium text-zinc-900">{a.name}</Td>
                      <Td>{a.area}</Td>
                      <Td>
                        <RiskBadge level={a.impact} />
                      </Td>
                      <Td className="text-zinc-700">{a.owner}</Td>
                      <Td className="font-medium text-zinc-900">{a.due}</Td>
                      <Td>
                        <span className="inline-flex items-center rounded-md bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-zinc-200/60">
                          {a.status}
                        </span>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="flex items-center justify-between">
                <div className="text-xs text-zinc-500">
                  Hermes/OpenClaw 将自动附加“停机原因/责任链/复发概率”并推送飞书群
                </div>
                <Button variant="outline" onClick={() => setAiOpen(true)}>
                  查看闭环效率
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-5">
            <CardHeader
              title="部门综合评分排行榜"
              description="本月绩效分 / 上月对比 / 红灯项"
              right={<Badge tone="watch">可下钻</Badge>}
            />
            <CardBody className="space-y-3">
              {mock.deptRank.map((d) => (
                <button
                  key={d.name}
                  type="button"
                  className="w-full rounded-xl border border-zinc-200/70 bg-white px-4 py-3 text-left shadow-sm transition-colors hover:bg-sky-50/40"
                  title="点击进入部门绩效详情"
                  onClick={() => setAiOpen(true)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-zinc-900">
                          {d.name}
                        </div>
                        <Badge tone={d.tone}>
                          {d.tone === "ok"
                            ? "稳定"
                            : d.tone === "watch"
                              ? "关注"
                              : "风险"}
                        </Badge>
                        {d.redItems > 0 ? (
                          <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-200">
                            红灯 {d.redItems}
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">
                        KPI/异常/人员/设备综合评分，可下钻查看红灯项与责任链
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-semibold tracking-tight text-zinc-900">
                        {d.score.toFixed(1)}
                      </div>
                      <div className="mt-1">
                        <Delta value={d.delta} />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </CardBody>
          </Card>

          <Card className="lg:col-span-7">
            <CardHeader
              title="部门状态热力矩阵"
              description="综合得分 / KPI 完成率 / 高风险员工 / 重点异常（点击下钻）"
              right={<Badge tone="ok">全局视图</Badge>}
            />
            <CardBody>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {mock.deptMatrix.map((d) => {
                  const tone: StatusTone =
                    d.score >= 88
                      ? "ok"
                      : d.score >= 82
                        ? "watch"
                        : "risk";
                  return (
                    <button
                      key={d.name}
                      type="button"
                      onClick={() => setAiOpen(true)}
                      className={cn(
                        "group w-full rounded-xl border border-zinc-200/70 bg-white p-4 text-left shadow-sm transition-colors hover:bg-zinc-50",
                      )}
                      title="点击进入部门详情"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-semibold text-zinc-900">
                              {d.name}
                            </div>
                            <Badge tone={tone}>
                              {tone === "ok"
                                ? "运行良好"
                                : tone === "watch"
                                  ? "需关注"
                                  : "高风险"}
                            </Badge>
                          </div>
                          <div className="mt-1 text-xs text-zinc-500">
                            Hover 提示：可下钻查看 KPI 明细、红灯项、责任人与闭环
                          </div>
                        </div>
                        <div className="rounded-lg bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-700 ring-1 ring-inset ring-sky-200/70">
                          {d.score.toFixed(1)}
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-lg bg-zinc-50 px-3 py-2 ring-1 ring-inset ring-zinc-200/60">
                          <div className="text-zinc-500">KPI 完成率</div>
                          <div className="mt-1 text-sm font-semibold text-zinc-900">
                            {d.kpi}%
                          </div>
                        </div>
                        <div className="rounded-lg bg-zinc-50 px-3 py-2 ring-1 ring-inset ring-zinc-200/60">
                          <div className="text-zinc-500">高风险员工</div>
                          <div className="mt-1 text-sm font-semibold text-rose-700">
                            {d.riskStaff}
                          </div>
                        </div>
                        <div className="rounded-lg bg-zinc-50 px-3 py-2 ring-1 ring-inset ring-zinc-200/60">
                          <div className="text-zinc-500">重点异常数</div>
                          <div className="mt-1 text-sm font-semibold text-zinc-900">
                            {d.anomalies}
                          </div>
                        </div>
                        <div className="flex items-end justify-end">
                          <span className="text-xs font-medium text-sky-700 opacity-0 transition-opacity group-hover:opacity-100">
                            进入部门详情 →
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-6">
            <CardHeader
              title="优秀员工 TOP 5"
              description="体现绩效可下钻：点击可进入员工考核详情"
              right={<Badge tone="ok">标杆</Badge>}
            />
            <CardBody className="space-y-3">
              {mock.topEmployees.map((e) => (
                <div
                  key={e.name}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-zinc-200/70 bg-white px-4 py-3 shadow-sm transition-colors hover:bg-sky-50/40 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold text-zinc-900">
                        {e.name}
                      </div>
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                        {e.tag}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">
                      {e.dept} · {e.role}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <div className="text-right">
                      <div className="text-xs text-zinc-500">绩效分</div>
                      <div className="text-lg font-semibold text-zinc-900">
                        {e.score}
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => setAiOpen(true)}>
                      查看考核详情
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <div className="text-xs text-zinc-500">
                  绩效分由 KPI + 质量贡献 + 异常闭环 + 协同评分综合计算
                </div>
                <Button variant="secondary" onClick={() => setAiOpen(true)}>
                  员工绩效检索
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card className="lg:col-span-6">
            <CardHeader
              title="重点关注员工"
              description="风险原因与建议动作（支持下钻到员工考核与班组排班）"
              right={<Badge tone="watch">需跟进</Badge>}
            />
            <CardBody className="space-y-3">
              {mock.focusEmployees.map((e) => (
                <div
                  key={e.name}
                  className="rounded-xl border border-zinc-200/70 bg-white px-4 py-3 shadow-sm transition-colors hover:bg-zinc-50"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-sm font-semibold text-zinc-900">
                          {e.name}
                        </div>
                        <span className="text-xs text-zinc-500">{e.dept}</span>
                        <RiskBadge level={e.level} />
                        <span className="inline-flex items-center rounded-md bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-zinc-200/60">
                          {e.status}
                        </span>
                      </div>
                      <div className="mt-2 text-xs leading-5 text-zinc-600">
                        <span className="font-medium text-zinc-700">风险原因：</span>
                        {e.reason}
                      </div>
                      <div className="mt-2 text-xs leading-5 text-zinc-600">
                        <span className="font-medium text-zinc-700">建议动作：</span>
                        {e.action}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setAiSelectedPrompt("查看张三本月绩效详情");
                          setAiOpen(true);
                        }}
                      >
                        查看考核详情
                      </Button>
                      <Button variant="secondary" onClick={() => setAiOpen(true)}>
                        跟进闭环
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-xs text-zinc-500">
                关联逻辑：出勤/响应时长异常将触发绩效扣分并关联到工序瓶颈与交付风险
              </div>
            </CardBody>
          </Card>
        </div>
        </>
        )}

        {activeNav === "production" && renderProduction()}
        {activeNav === "quality" && renderQuality()}
        {activeNav === "performance" && renderPerformance()}
        {activeNav === "risk" && renderRisk()}
        {activeNav === "ai" && renderAi()}
      </main>

      <button
        type="button"
        onClick={() => setAiOpen(true)}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-900/20 transition-colors hover:bg-zinc-800"
        title="打开 AI 助手"
      >
        <Icon name="bot" />
        AI 助手
      </button>

      <Drawer
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        title="AI 助手 · SpringOps"
        subtitle="DeepSeek 分析 · Hermes / OpenClaw 智能巡检 · 经营/生产/质量/绩效一体化"
      >
        <div className="space-y-4 p-5">
          <Card>
            <CardHeader
              title="预设问题"
              description="点击快速生成管理分析结论（模拟演示）"
            />
            <CardBody>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {aiPrompts.map((p) => (
                  <Button
                    key={p}
                    variant={aiSelectedPrompt === p ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setAiSelectedPrompt(p)}
                  >
                    {p}
                  </Button>
                ))}
              </div>
              <div className="mt-3 text-xs text-zinc-500">
                提示：真实产品中将从飞书工单/巡检/绩效规则引擎获取快照并支持追溯
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="管理分析助手回复（模拟）"
              description="强调“结论—依据—影响—建议动作”的管理风格"
              right={<Badge tone="ok">DeepSeek</Badge>}
            />
            <CardBody>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-6 text-zinc-800">
                <pre className="whitespace-pre-wrap font-sans">{aiAnswer}</pre>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => setAiSelectedPrompt(null)}>
                  生成今日经营简报
                </Button>
                <Button variant="outline" onClick={() => setAiOpen(false)}>
                  返回驾驶舱
                </Button>
                <Button variant="outline" onClick={() => setAiOpen(true)}>
                  查看巡检证据链
                </Button>
              </div>
              <div className="mt-3 text-xs text-zinc-500">
                巡检证据链示例：停机事件 → 责任人 → 工单闭环 → 复发概率 → 对交付/绩效影响
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="AI 工具动作（演示）"
              description="体现企业系统能力：可推送飞书、生成工单、自动升级预警"
            />
            <CardBody>
              <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" onClick={() => {}}>
                  推送“热处理炉 #3 停机”诊断到飞书群（模拟）
                </Button>
                <Button variant="outline" onClick={() => {}}>
                  为“夜班缺口”创建排班协同工单（模拟）
                </Button>
                <Button variant="outline" onClick={() => {}}>
                  将延期风险订单升级为“红色预警”并通知责任部门（模拟）
                </Button>
              </div>
              <div className="mt-3 text-xs text-zinc-500">
                说明：本 Demo 不依赖后端，真实产品中这些动作将通过飞书开放平台与规则引擎执行
              </div>
            </CardBody>
          </Card>
        </div>
      </Drawer>
    </div>
  );
}
