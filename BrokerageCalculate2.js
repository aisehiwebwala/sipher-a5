// 0 -> Intraday
// 1 -> Delivery
// GST -> 18%

const RS_CHARGES = [
  {
    STT: { BUY: 0.0, SELL: 0.025 },
    SDC: { BUY: 0.003, SELL: 0.0 },
    ETC: { BUY: 0.00297, SELL: 0.00297 },
    STC: { BUY: 0.0001, SELL: 0.0001 },
    DPC: { BUY: 0.0, SELL: 0.0 },
    IPFTC: { BUY: 0.0001, SELL: 0.0001 }
  },
  {
    STT: { BUY: 0.1, SELL: 0.1 },
    SDC: { BUY: 0.015, SELL: 0.0 },
    ETC: { BUY: 0.00297, SELL: 0.00297 },
    STC: { BUY: 0.0001, SELL: 0.0001 },
    DPC: { BUY: 0.0, SELL: 20.0 },
    IPFTC: { BUY: 0.0001, SELL: 0.0001 }
  },
  {
    STT: { BUY: 0.0, SELL: 0.1 },
    SDC: { BUY: 0.003, SELL: 0.0 },
    ETC: { BUY: 0.03503, SELL: 0.03503 },
    STC: { BUY: 0.0001, SELL: 0.0001 },
    DPC: { BUY: 0.0, SELL: 0.0 },
    IPFTC: { BUY: 0.0005, SELL: 0.0005 }
  }
];

const GROW_BRKG = [
  { MIN_PRICE: 5.0, MAX_PRICE: 20.0, RATE: 0.1 },
  { MIN_PRICE: 5.0, MAX_PRICE: 20.0, RATE: 0.1 },
  { MIN_PRICE: 20.0, MAX_PRICE: 20.0, RATE: 0.0 }
];

const GST = 0.18

const getc = (elem, i1, i2) => {
  return elem.children[i1].children[i2];
};

const GET_BROKERAGE_SUMMARY = (buy_price, sell_price, quantity, delivery) => {
  buy_price = parseFloat(buy_price);
  sell_price = parseFloat(sell_price);
  quantity = parseFloat(quantity);
  delivery = parseInt(delivery);

  const buy_total = parseFloat(buy_price * quantity);
  const sell_total = parseFloat(sell_price * quantity);

  let TOTAl_CHARGES = {
    BUY: { GBKG: 0.0, STT: 0.0, SDC: 0.0, ETC: 0.0, STC: 0.0, IPFTC: 0.0, DPC: 0.0, GST: 0.0 },
    SELL: { GBKG: 0.0, STT: 0.0, SDC: 0.0, ETC: 0.0, STC: 0.0, IPFTC: 0.0, DPC: 0.0, GST: 0.0 }
  };

  TOTAl_CHARGES.BUY.GBKG = parseFloat(Math.max(GROW_BRKG[delivery].MIN_PRICE, Math.min(GROW_BRKG[delivery].MAX_PRICE, 0.01 * GROW_BRKG[delivery].RATE * buy_total)).toFixed(2));
  TOTAl_CHARGES.SELL.GBKG = parseFloat(Math.max(GROW_BRKG[delivery].MIN_PRICE, Math.min(GROW_BRKG[delivery].MAX_PRICE, 0.01 * GROW_BRKG[delivery].RATE * sell_total)).toFixed(2));

  TOTAl_CHARGES.BUY.STT = parseFloat((0.01 * RS_CHARGES[delivery].STT.BUY * buy_total).toFixed(0));
  TOTAl_CHARGES.SELL.STT = parseFloat((0.01 * RS_CHARGES[delivery].STT.SELL * sell_total).toFixed(0));

  TOTAl_CHARGES.BUY.SDC = parseFloat((0.01 * RS_CHARGES[delivery].SDC.BUY * buy_total).toFixed(0));

  TOTAl_CHARGES.BUY.ETC = parseFloat((0.01 * RS_CHARGES[delivery].ETC.BUY * buy_total).toFixed(2));
  TOTAl_CHARGES.SELL.ETC = parseFloat((0.01 * RS_CHARGES[delivery].ETC.SELL * sell_total).toFixed(2));

  TOTAl_CHARGES.BUY.STC = parseFloat((0.01 * RS_CHARGES[delivery].STC.BUY * buy_total).toFixed(2));
  TOTAl_CHARGES.SELL.STC = parseFloat((0.01 * RS_CHARGES[delivery].STC.SELL * sell_total).toFixed(2));

  TOTAl_CHARGES.BUY.IPFTC = parseFloat((0.01 * RS_CHARGES[delivery].IPFTC.BUY * buy_total).toFixed(2));
  TOTAl_CHARGES.SELL.IPFTC = parseFloat((0.01 * RS_CHARGES[delivery].IPFTC.SELL * sell_total).toFixed(2));

  TOTAl_CHARGES.SELL.DPC = parseFloat(RS_CHARGES[delivery].DPC.SELL);

  TOTAl_CHARGES.BUY.GST = parseFloat((
    (TOTAl_CHARGES.BUY.GBKG +
      TOTAl_CHARGES.BUY.DPC +
      TOTAl_CHARGES.BUY.ETC +
      TOTAl_CHARGES.BUY.IPFTC +
      TOTAl_CHARGES.BUY.STC
    ) * GST
  ).toFixed(2)
  );

  TOTAl_CHARGES.SELL.GST = parseFloat((
    (TOTAl_CHARGES.SELL.GBKG +
      TOTAl_CHARGES.SELL.DPC +
      TOTAl_CHARGES.SELL.ETC +
      TOTAl_CHARGES.SELL.IPFTC +
      TOTAl_CHARGES.SELL.STC
    ) *
    GST
  ).toFixed(2)
  );

  return TOTAl_CHARGES;
};

const GET_DETAILED_SUMMARY = (buy_price, sell_price, quantity, delivery) => {
  const BROKERAGE_SUMMARY = GET_BROKERAGE_SUMMARY(buy_price, sell_price, quantity, delivery)
  const DETAILED_SUMMARY = {
    buyPrice: buy_price,
    sellPrice: sell_price,
    totalBuyAmount: buy_price * quantity,
    totalSellAmount: sell_price * quantity,
    turnover: 0.0,
    totalGrowBrokerage: 0.0,
    totalNonGrowBrokerage: 0.0,
    totalBuyBrokerage: 0.0,
    totalSellBrokerage: 0.0,
    totalBrokerage: 0.0,
    netPnL: 0.0,
  }

  DETAILED_SUMMARY["turnover"] = DETAILED_SUMMARY["totalSellAmount"] - DETAILED_SUMMARY["totalBuyAmount"]
  DETAILED_SUMMARY["totalGrowBrokerage"] = BROKERAGE_SUMMARY["BUY"]["GBKG"] + BROKERAGE_SUMMARY["SELL"]["GBKG"]

  for (x in BROKERAGE_SUMMARY["BUY"]) {
    DETAILED_SUMMARY["totalBrokerage"] += BROKERAGE_SUMMARY["BUY"][x]
    DETAILED_SUMMARY["totalBuyBrokerage"] += BROKERAGE_SUMMARY["BUY"][x]
  }
  for (x in BROKERAGE_SUMMARY["SELL"]) {
    DETAILED_SUMMARY["totalBrokerage"] += BROKERAGE_SUMMARY["SELL"][x]
    DETAILED_SUMMARY["totalSellBrokerage"] += BROKERAGE_SUMMARY["SELL"][x]
  }

  DETAILED_SUMMARY["totalNonGrowBrokerage"] = DETAILED_SUMMARY["totalBrokerage"] - DETAILED_SUMMARY["totalGrowBrokerage"]
  DETAILED_SUMMARY["netPnL"] = DETAILED_SUMMARY["turnover"] - DETAILED_SUMMARY["totalBrokerage"]

  return { ...DETAILED_SUMMARY, BROKERAGE_SUMMARY }
}

const HANDLE_CHANGE = (event) => {
  let buy_price = parseFloat(document.getElementById("buyp").value);
  let sell_price = parseFloat(document.getElementById("sellp").value);
  let qty = parseFloat(document.getElementById("qty").value);
  const delivery = parseInt(document.getElementById("tr_type").value);


  if (!buy_price) buy_price = 0.00;
  if (!sell_price) sell_price = 0.00;
  if (!qty) qty = 0.00;


  const TOTAl_CHARGES = GET_DETAILED_SUMMARY(
    buy_price,
    sell_price,
    qty,
    delivery
  ).BROKERAGE_SUMMARY;

  FILL_VALUES(TOTAl_CHARGES, { buy_price, sell_price, qty });
};

const calculatePercentage = (num1, num2) => {
  num1 = parseFloat(num1)
  num2 = parseFloat(num2)

  if (num2 == 0.00) return num2.toFixed(2)

  return ((num1 * 100.00) / num2).toFixed(2)
}

const FILL_VALUES = (TOTAl_CHARGES, { buy_price, sell_price, qty }) => {
  const tbody = document.getElementsByTagName("tbody")[0];
  getc(tbody, 0, 1).innerText = TOTAl_CHARGES.BUY.GBKG.toFixed(2);
  getc(tbody, 0, 2).innerText = TOTAl_CHARGES.SELL.GBKG.toFixed(2);
  getc(tbody, 0, 3).innerText = (TOTAl_CHARGES.BUY.GBKG + TOTAl_CHARGES.SELL.GBKG).toFixed(2);

  getc(tbody, 1, 1).innerText = TOTAl_CHARGES.BUY.STT.toFixed(2);
  getc(tbody, 1, 2).innerText = TOTAl_CHARGES.SELL.STT.toFixed(2);
  getc(tbody, 1, 3).innerText = (TOTAl_CHARGES.BUY.STT + TOTAl_CHARGES.SELL.STT).toFixed(2);

  getc(tbody, 2, 1).innerText = TOTAl_CHARGES.BUY.SDC.toFixed(2);
  getc(tbody, 2, 2).innerText = TOTAl_CHARGES.SELL.SDC.toFixed(2);
  getc(tbody, 2, 3).innerText = (TOTAl_CHARGES.BUY.SDC + TOTAl_CHARGES.SELL.SDC).toFixed(2);

  getc(tbody, 3, 1).innerText = TOTAl_CHARGES.BUY.ETC.toFixed(2);
  getc(tbody, 3, 2).innerText = TOTAl_CHARGES.SELL.ETC.toFixed(2);
  getc(tbody, 3, 3).innerText = (TOTAl_CHARGES.BUY.ETC + TOTAl_CHARGES.SELL.ETC).toFixed(2);

  getc(tbody, 4, 1).innerText = TOTAl_CHARGES.BUY.STC.toFixed(2);
  getc(tbody, 4, 2).innerText = TOTAl_CHARGES.SELL.STC.toFixed(2);
  getc(tbody, 4, 3).innerText = (TOTAl_CHARGES.BUY.STC + TOTAl_CHARGES.SELL.STC).toFixed(2);

  getc(tbody, 5, 1).innerText = TOTAl_CHARGES.BUY.DPC.toFixed(2);
  getc(tbody, 5, 2).innerText = TOTAl_CHARGES.SELL.DPC.toFixed(2);
  getc(tbody, 5, 3).innerText = (TOTAl_CHARGES.BUY.DPC + TOTAl_CHARGES.SELL.DPC).toFixed(2);

  getc(tbody, 6, 1).innerText = TOTAl_CHARGES.BUY.IPFTC.toFixed(2);
  getc(tbody, 6, 2).innerText = TOTAl_CHARGES.SELL.IPFTC.toFixed(2);
  getc(tbody, 6, 3).innerText = (TOTAl_CHARGES.BUY.IPFTC + TOTAl_CHARGES.SELL.IPFTC).toFixed(2);

  getc(tbody, 7, 1).innerText = TOTAl_CHARGES.BUY.GST.toFixed(2);
  getc(tbody, 7, 2).innerText = TOTAl_CHARGES.SELL.GST.toFixed(2);
  getc(tbody, 7, 3).innerText = (TOTAl_CHARGES.BUY.GST + TOTAl_CHARGES.SELL.GST).toFixed(2);


  const turnovers = document.getElementById("turnovers");

  let total_buy_charges = 0.00;
  let total_sell_charges = 0.00;
  for (x in TOTAl_CHARGES["BUY"]) {
    total_buy_charges += TOTAl_CHARGES["BUY"][x];
  }
  for (x in TOTAl_CHARGES["SELL"]) {
    total_sell_charges += TOTAl_CHARGES["SELL"][x];
  }

  const profit = (sell_price - buy_price) * qty;
  const total_charges = parseFloat((total_buy_charges + total_sell_charges).toFixed(2));
  const total_profit = profit - total_charges;

  getc(tbody, 8, 1).innerText = total_buy_charges.toFixed(2);
  getc(tbody, 8, 2).innerText = total_sell_charges.toFixed(2);
  getc(tbody, 8, 3).innerText = total_charges.toFixed(2);

  turnovers.children[0].innerText = parseFloat(buy_price * qty.toFixed(2)).toLocaleString("en-IN", { "style": "currency", "currency": "INR" });
  turnovers.children[1].innerText = parseFloat(sell_price * qty.toFixed(2)).toLocaleString("en-IN", { "style": "currency", "currency": "INR" });
  turnovers.children[2].innerHTML = parseFloat(profit.toFixed(2)).toLocaleString("en-IN", { "style": "currency", "currency": "INR" }) + ` <span style="position: absolute;"><small style="font-size: 0.75rem;margin-left: 3px;">@ ${calculatePercentage(profit, buy_price * qty)}%</small></span>`;
  turnovers.children[3].innerText = parseFloat(total_charges.toFixed(2)).toLocaleString("en-IN", { "style": "currency", "currency": "INR" });
  turnovers.children[4].innerHTML = parseFloat(total_profit.toFixed(2)).toLocaleString("en-IN", { "style": "currency", "currency": "INR" }) + ` <span style="position: absolute;"><small style="font-size: 0.75rem;margin-left: 3px;">@ ${calculatePercentage(total_profit, buy_price * qty)}%</small></span>`;

  turnovers.children[2].className = profit >= 0 ? "positive" : "negative";
  turnovers.children[4].className = total_profit >= 0 ? "positive" : "negative";

};
