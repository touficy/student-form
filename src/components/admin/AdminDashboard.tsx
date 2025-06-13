import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StudentTable } from "./StudentTable";
import { supabase } from "@/integrations/supabase/client";

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  gender: string;
  date_of_birth: string;
  blood_group: string;
  mother_mobile: string;
  mother_occupation: string;
  created_at: string;
  gradeLevel?: string; // Mock field generated from age
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  const recordsPerPage = 10;

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        const studentsWithGrades = (data || []).map((student: any) => ({
          ...student,
          gradeLevel: generateMockGradeLevel(student.date_of_birth),
        }));
        
        setStudents(studentsWithGrades);
      } catch (error) {
        console.error('Error loading students:', error);
        setStudents([]);
      }
    };

    loadStudents();
  }, []);

  const generateMockGradeLevel = (dateOfBirth: string) => {
    if (!dateOfBirth) return "Grade 12";
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    // Mock grade levels based on age (assuming 18+ students)
    if (age >= 18 && age <= 19) return "Grade 12";
    if (age >= 20 && age <= 22) return "Undergraduate";
    if (age >= 23 && age <= 25) return "Graduate";
    return "Postgraduate";
  };

  // Filter and search logic
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = 
        `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGrade = gradeFilter === "all" || student.gradeLevel === gradeFilter;
      const matchesBloodGroup = bloodGroupFilter === "all" || student.blood_group === bloodGroupFilter;
      
      return matchesSearch && matchesGrade && matchesBloodGroup;
    });
  }, [students, searchTerm, gradeFilter, bloodGroupFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + recordsPerPage);

  // Get unique values for filters
  const uniqueGradeLevels = [...new Set(students.map(s => s.gradeLevel))].filter(Boolean);
  const uniqueBloodGroups = [...new Set(students.map(s => s.blood_group))].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Student Admin Panel</h1>
            <p className="text-muted-foreground">Manage and view all registered students</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{students.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Filtered Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{filteredStudents.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Grade Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{uniqueGradeLevels.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Blood Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{uniqueBloodGroups.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Grade Level</label>
                <Select value={gradeFilter} onValueChange={(value) => {
                  setGradeFilter(value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Grades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    {uniqueGradeLevels.map(grade => (
                      <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Blood Group</label>
                <Select value={bloodGroupFilter} onValueChange={(value) => {
                  setBloodGroupFilter(value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Blood Groups" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Blood Groups</SelectItem>
                    {uniqueBloodGroups.map(group => (
                      <SelectItem key={group} value={group}>{group}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Table */}
        <StudentTable 
          students={paginatedStudents}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalRecords={filteredStudents.length}
          recordsPerPage={recordsPerPage}
        />
      </div>
    </div>
  );
};