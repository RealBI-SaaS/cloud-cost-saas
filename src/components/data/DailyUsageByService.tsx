import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Sample data shape (flattened):
// [
//   { service_name: "Amazon VPC", day: "2025-04-07T00:00:00Z", total_usage: 24.0 },
//   { service_name: "Amazon EC2", day: "2025-04-07T00:00:00Z", total_usage: 20.0 },
//   { service_name: "Amazon VPC", day: "2025-04-08T00:00:00Z", total_usage: 22.0 },
//   ...
// ]
//
//
// const data = [
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-01T00:00:00Z",
//     total_usage: 0.640443,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-01T00:00:00Z",
//     total_usage: 24.065137,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-01T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-02T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-02T00:00:00Z",
//     total_usage: 24.05676,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-02T00:00:00Z",
//     total_usage: 0.570633,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-03T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-03T00:00:00Z",
//     total_usage: 0.554408,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-03T00:00:00Z",
//     total_usage: 24.051697,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-04T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-04T00:00:00Z",
//     total_usage: 24.033271,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-04T00:00:00Z",
//     total_usage: 0.550002,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-05T00:00:00Z",
//     total_usage: 0.540966,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-05T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-05T00:00:00Z",
//     total_usage: 24.015471,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-06T00:00:00Z",
//     total_usage: 24.013757,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-06T00:00:00Z",
//     total_usage: 0.540551,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-06T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-07T00:00:00Z",
//     total_usage: 0.569543,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-07T00:00:00Z",
//     total_usage: 22.323201,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-07T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-08T00:00:00Z",
//     total_usage: 24.047536,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-08T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-08T00:00:00Z",
//     total_usage: 0.568671,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-09T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-09T00:00:00Z",
//     total_usage: 0.571065,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-09T00:00:00Z",
//     total_usage: 24.129752,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-10T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-10T00:00:00Z",
//     total_usage: 24.062093,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-10T00:00:00Z",
//     total_usage: 0.557864,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-11T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-11T00:00:00Z",
//     total_usage: 24.046792,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-11T00:00:00Z",
//     total_usage: 0.550461,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-12T00:00:00Z",
//     total_usage: 0.539875,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-12T00:00:00Z",
//     total_usage: 24.011968,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-12T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-13T00:00:00Z",
//     total_usage: 24.015637,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-13T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-13T00:00:00Z",
//     total_usage: 0.537852,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-14T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-14T00:00:00Z",
//     total_usage: 24.069386,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-14T00:00:00Z",
//     total_usage: 0.559129,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-15T00:00:00Z",
//     total_usage: 24.06709,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-15T00:00:00Z",
//     total_usage: 0.573906,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-15T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-16T00:00:00Z",
//     total_usage: 24.063913,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-16T00:00:00Z",
//     total_usage: 0.560756,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-16T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-17T00:00:00Z",
//     total_usage: 0.559187,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-17T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-17T00:00:00Z",
//     total_usage: 24.041084,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-18T00:00:00Z",
//     total_usage: 24.041143,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-18T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-18T00:00:00Z",
//     total_usage: 0.547979,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-19T00:00:00Z",
//     total_usage: 0.538522,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-19T00:00:00Z",
//     total_usage: 24.013026,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-19T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-20T00:00:00Z",
//     total_usage: 24.010321,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-20T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-20T00:00:00Z",
//     total_usage: 0.539179,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-21T00:00:00Z",
//     total_usage: 24.080128,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-21T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-21T00:00:00Z",
//     total_usage: 0.555475,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-22T00:00:00Z",
//     total_usage: 0.556123,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-22T00:00:00Z",
//     total_usage: 24.057241,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-22T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-23T00:00:00Z",
//     total_usage: 0.633438,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-23T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-23T00:00:00Z",
//     total_usage: 24.061067,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-24T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-24T00:00:00Z",
//     total_usage: 24.048846,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-24T00:00:00Z",
//     total_usage: 0.555567,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-25T00:00:00Z",
//     total_usage: 24.040798,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-25T00:00:00Z",
//     total_usage: 0.551967,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-25T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-26T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-26T00:00:00Z",
//     total_usage: 24.011837,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-26T00:00:00Z",
//     total_usage: 0.541333,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-27T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-27T00:00:00Z",
//     total_usage: 0.540019,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-27T00:00:00Z",
//     total_usage: 24.008215,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-28T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-28T00:00:00Z",
//     total_usage: 0.558374,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-28T00:00:00Z",
//     total_usage: 24.049041,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-29T00:00:00Z",
//     total_usage: 0.559258,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-29T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-29T00:00:00Z",
//     total_usage: 24.098865,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-04-30T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-04-30T00:00:00Z",
//     total_usage: 0.559421,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-04-30T00:00:00Z",
//     total_usage: 24.041898,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-01T00:00:00Z",
//     total_usage: 0.535405,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-01T00:00:00Z",
//     total_usage: 24.051498,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-01T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-02T00:00:00Z",
//     total_usage: 24.030593,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-02T00:00:00Z",
//     total_usage: 0.536991,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-02T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-03T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-03T00:00:00Z",
//     total_usage: 0.521758,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-03T00:00:00Z",
//     total_usage: 24.009137,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-04T00:00:00Z",
//     total_usage: 0.521096,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-04T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-04T00:00:00Z",
//     total_usage: 24.010432,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-05T00:00:00Z",
//     total_usage: 24.047287,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-05T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-05T00:00:00Z",
//     total_usage: 0.537189,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-06T00:00:00Z",
//     total_usage: 0.614273,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-06T00:00:00Z",
//     total_usage: 24.044602,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-06T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-07T00:00:00Z",
//     total_usage: 0.542639,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-07T00:00:00Z",
//     total_usage: 24.082814,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-07T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-08T00:00:00Z",
//     total_usage: 0.549448,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-08T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-08T00:00:00Z",
//     total_usage: 24.056351,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-09T00:00:00Z",
//     total_usage: 24.035002,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-09T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-09T00:00:00Z",
//     total_usage: 0.537235,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-10T00:00:00Z",
//     total_usage: 24.024673,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-10T00:00:00Z",
//     total_usage: 0.521946,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-10T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-11T00:00:00Z",
//     total_usage: 24.013606,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-11T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-11T00:00:00Z",
//     total_usage: 0.522291,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-12T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-12T00:00:00Z",
//     total_usage: 0.54009,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-12T00:00:00Z",
//     total_usage: 24.03641,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-13T00:00:00Z",
//     total_usage: 0.536305,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-13T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-13T00:00:00Z",
//     total_usage: 24.032818,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-14T00:00:00Z",
//     total_usage: 24.052124,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-14T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-14T00:00:00Z",
//     total_usage: 0.547721,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-15T00:00:00Z",
//     total_usage: 0.53786,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-15T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-15T00:00:00Z",
//     total_usage: 24.041915,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-16T00:00:00Z",
//     total_usage: 0.608243,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-16T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-16T00:00:00Z",
//     total_usage: 24.037248,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-17T00:00:00Z",
//     total_usage: 24.013253,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-17T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-17T00:00:00Z",
//     total_usage: 0.521736,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-18T00:00:00Z",
//     total_usage: 0.522463,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-18T00:00:00Z",
//     total_usage: 24.008977,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-18T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-19T00:00:00Z",
//     total_usage: 0.539973,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-19T00:00:00Z",
//     total_usage: 24.055542,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-19T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-20T00:00:00Z",
//     total_usage: 24.044229,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-20T00:00:00Z",
//     total_usage: 0.540697,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-20T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-21T00:00:00Z",
//     total_usage: 0.556502,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-21T00:00:00Z",
//     total_usage: 24.074006,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-21T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-22T00:00:00Z",
//     total_usage: 24.042557,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-22T00:00:00Z",
//     total_usage: 0.539057,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-22T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-23T00:00:00Z",
//     total_usage: 24.029936,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-23T00:00:00Z",
//     total_usage: 0.534745,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-23T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-24T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-24T00:00:00Z",
//     total_usage: 24.009438,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-24T00:00:00Z",
//     total_usage: 0.521839,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-25T00:00:00Z",
//     total_usage: 0.520037,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-25T00:00:00Z",
//     total_usage: 24.010154,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-25T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-26T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-26T00:00:00Z",
//     total_usage: 24.021688,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-26T00:00:00Z",
//     total_usage: 0.522535,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-27T00:00:00Z",
//     total_usage: 24.071368,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-27T00:00:00Z",
//     total_usage: 0.546651,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-27T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-28T00:00:00Z",
//     total_usage: 24.039513,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-28T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-28T00:00:00Z",
//     total_usage: 0.536798,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-29T00:00:00Z",
//     total_usage: 0.540516,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-29T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-29T00:00:00Z",
//     total_usage: 24.046943,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-30T00:00:00Z",
//     total_usage: 0.533402,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-30T00:00:00Z",
//     total_usage: 24.0,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-30T00:00:00Z",
//     total_usage: 24.02834,
//   },
//   {
//     service_name: "EC2 - Other",
//     day: "2025-05-31T00:00:00Z",
//     total_usage: 0.525126,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     day: "2025-05-31T00:00:00Z",
//     total_usage: 24.024592,
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     day: "2025-05-31T00:00:00Z",
//     total_usage: 24.0,
//   },
// ];

interface UsageRecord {
  service_name: string;
  day: string; // ISO string date
  total_usage: number;
}

interface Props {
  data: UsageRecord[];
}

const COLORS = [
  "#4F46E5", // Indigo
  "#E11D48", // Red
  "#2563EB", // Blue
  "#16A34A", // Green
  "#D97706", // Amber
];

const UsageByServiceChart: React.FC<Props> = ({ data }) => {
  // Step 1: Convert flat data into a format where each day is a row,
  // and each service is a key with total_usage value.
  // Example:
  // [
  //   { day: "2025-04-07", "Amazon VPC": 24, "Amazon EC2": 20 },
  //   { day: "2025-04-08", "Amazon VPC": 22, "Amazon EC2": 18 },
  // ]

  // Get unique days sorted ascending
  const days = Array.from(new Set(data.map((d) => d.day.slice(0, 10)))).sort();

  // Get unique services
  const services = Array.from(new Set(data.map((d) => d.service_name)));

  // Build data structure
  const chartData = days.map((day) => {
    const dayData: Record<string, any> = { day };
    services.forEach((service) => {
      const record = data.find(
        (d) => d.day.startsWith(day) && d.service_name === service,
      );
      dayData[service] = record ? record.total_usage : 0;
    });
    return dayData;
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Cost By Service Per Day</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          {services.map((service, index) => (
            <Line
              key={service}
              type="monotone"
              dataKey={service}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsageByServiceChart;
