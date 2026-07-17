import dns from "node:dns";

// Force Node's DNS resolver to use Google DNS
dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
]);

console.log("DNS Override:", dns.getServers());