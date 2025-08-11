import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'shadcn/ui/card';
import { Badge } from 'shadcn/ui/badge';
import { Check, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'shadcn/ui/table';

// This is a placeholder for your server-sent data.
// You would replace this with a fetch call or props.
const mockServerData = {
  childDetails: {
    name: 'Anish Thapa',
    gender: 'Male',
    dob: '2025-05-20',
    registrationId: 'V-000123',
  },
  vaccines: [
    {
      name: 'BCG',
      schedule: [{ recommendedAt: 'At birth' }],
      given: [{ date: '2025-05-20' }],
    },
    {
      name: 'OPV',
      schedule: [
        { recommendedAt: '6 weeks' },
        { recommendedAt: '10 weeks' },
        { recommendedAt: '14 weeks' },
      ],
      given: [{ date: '2025-07-01' }, null, { date: '2025-08-11' }],
    },
    {
      name: 'PCV',
      schedule: [{ recommendedAt: '6 weeks' }, { recommendedAt: '10 weeks' }],
      given: [null, { date: '2025-08-01' }],
    },
    {
      name: 'Measles',
      schedule: [{ recommendedAt: '9 months' }, { recommendedAt: '15 months' }],
      given: [null, null],
    },
    {
      name: 'DPT',
      schedule: [
        { recommendedAt: '6 weeks' },
        { recommendedAt: '10 weeks' },
        { recommendedAt: '14 weeks' },
      ],
      given: [{ date: '2025-07-01' }, { date: '2025-08-01' }, null],
    },
  ],
};

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // In a real application, you would fetch data from your server here.
  useEffect(() => {
    // Simulating a server request delay.
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setData(mockServerData);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-500">Loading vaccination data...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-500">No data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 p-4 md:p-8 min-h-screen flex items-start justify-center font-sans antialiased">
      <Card className="w-full max-w-4xl shadow-lg rounded-2xl overflow-hidden animate-fade-in">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
          <CardTitle className="text-3xl font-bold">
            Child Vaccination Card
          </CardTitle>
          <CardDescription className="text-blue-200 text-base">
            Detailed record of a child's vaccination history.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          {/* Child Details Section */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 border-b pb-4">
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">
                Child's Name
              </p>
              <p className="font-bold text-gray-900 dark:text-white">
                {data.childDetails.name}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">
                Gender
              </p>
              <p className="font-bold text-gray-900 dark:text-white">
                {data.childDetails.gender}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">
                Date of Birth
              </p>
              <p className="font-bold text-gray-900 dark:text-white">
                {data.childDetails.dob}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">
                Registration ID
              </p>
              <p className="font-bold text-gray-900 dark:text-white">
                {data.childDetails.registrationId}
              </p>
            </div>
          </div>

          {/* Vaccination Record Section */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Vaccine</TableHead>
                  <TableHead>Recommended at</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Given Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.vaccines.map((vaccine, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {vaccine.name}
                    </TableCell>
                    <TableCell>
                      {vaccine.schedule.map((dose, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="mr-1 mt-1 text-xs"
                        >
                          {dose.recommendedAt}
                        </Badge>
                      ))}
                    </TableCell>
                    <TableCell>
                      {vaccine.given.map((dose, i) => (
                        <span key={i} className="inline-flex items-center mr-2">
                          {dose ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                        </span>
                      ))}
                    </TableCell>
                    <TableCell className="text-right">
                      {vaccine.given.map((dose, i) => (
                        <p key={i} className="text-sm">
                          {dose ? dose.date : 'N/A'}
                        </p>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
