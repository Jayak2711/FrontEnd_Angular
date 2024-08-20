import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { ProductService } from '../services/product.service';
import Chart from 'chart.js/auto';
import { UserService } from '../services/user.service';
import { interval, Subscription } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private slideInterval: Subscription | undefined;
  images  = [
    { src: '../../assets/images/banner5.jpeg', alt: 'Image 1', title: 'Welcome to Our Store', description: 'Find the best products here.' },
    { src: '../../assets/images/banner4.jpeg', alt: 'Image 2', title: 'Quality Products', description: 'Top quality and great deals.' },
    { src: '../../assets/images/sale.jpeg', alt: 'Image 3', title: 'Exclusive Offers', description: 'Don\'t miss out on our special offers.' }
  ];
  currentIndex = 0;
  public chart1: any;
  showLoginMessage: boolean = false;
  chart: any;
  orderAdmin: any;
  private labeldata: any[] = [];
  saleCount: any[] = [];
  private colordata: any[] = [];
  datesOfMonth: Date[] = [];
  formattedDates: string[] = [];
  januaryDates: any;
  pastTenYears: any;
  d = new Date();
  monthName = this.d.getMonth();
  months: { name: string, number: number }[] = [
    { name: 'January', number: 0 },
    { name: 'February', number: 1 },
    { name: 'March', number: 2 },
    { name: 'April', number: 3 },
    { name: 'May', number: 4 },
    { name: 'June', number: 5 },
    { name: 'July', number: 6 },
    { name: 'August', number: 7 },
    { name: 'September', number: 8 },
    { name: 'October', number: 9 },
    { name: 'November', number: 10 },
    { name: 'December', number: 11 }
  ];
  newProducts = [
    {
      title: 'Saree',
      // description: 'Description for Product 1',
      price: 3000,
      imageUrl: '../../assets/images/saree.jpeg'
    },
    {
      title: 'Watch',
      // description: 'Description for Product 2',
      price: 5000,
      imageUrl: '../../assets/images/watch.jpeg'
    },
    {
      title: 'Kids car',
      // description: 'Description for Product 2',
      price: 5000,
      imageUrl: '../../assets/images/kid_car.jpeg'
    },
   
    // Add more products as needed
  ];
  monthNumber: number = 0;
  yearClickedData: number = 2024;
  // monthName: any = 'January';
  userDetails: any;
  loading: any;
   predefinedColors = [
   '#ADD8E6', // Light Blue
  '#FFB6C1', // Light Pink
  '#90EE90', // Light Green
  '#FFFFE0', // Light Yellow
  '#F08080', // Light Coral
  '#2F4F4F', // Dark Slate Gray
  '#B19CD9', // Pastel Purple
  '#FF0000', // Vibrant Red
  '#F5F5F5'  // White Smoke
  ];
  chartClick: boolean = false;

  constructor(private cartService: CartService, private productService: ProductService,
    private orderService: OrderService, private authService: AuthService, private router: Router,
     private cdr: ChangeDetectorRef, private userService: UserService) {

  }

  ngOnInit(): void {
    this.loading = true;
    setTimeout(() => {
      sessionStorage.removeItem('orderDate');
      this.loading = false;

      if (!this.authService.isAuthenticated()) {
        this.showLoginMessage = true;
      }
      if(this.authService.getCurrentUser().is_admin == true){
        this.pastTenYears = this.getPastTenYears();
        this.getCategoryReport();
        this.changeChart();
      }else{
        const userId = this.authService.getCurrentUser()?.user_id;
        if (userId) {
          this.userService.getUser(userId).subscribe((user :any) => {
            if(user.result.addressid == null){
              alert('Complete your profile')
              this.router.navigate(['/settings'])
            }
          });
        } 
      }
    }, 2000);
    this.startAutoSlide();
    this.userDetails = sessionStorage.getItem('currentUser');
    this.monthNumber = this.monthName;
    let monthName: any = this.months.find((element) => element.number == this.monthNumber);
    this.monthName = monthName.name;

  
  }

  getCategoryReport(){
    this.orderService.getCategoryReport().subscribe(data => {
      console.log(data.result)
      this.createChart1(data.result);
    })
  }

  get isAuthenticated() {
    return this.userDetails;
  }

  get getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  show() {
    if (!this.authService.isAuthenticated()) {
      this.showLoginMessage = true;
      alert("Please login to place an order");
      this.router.navigate(['/auth/login']);
      return;
    }
  }
  
  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // JavaScript months are 0-based
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  }

  getOrderForAdmin() {
    const year = this.yearClickedData; // Set the desired year here
    const month = this.monthNumber; // Set the desired month here (0 = January, 11 = December)
    this.orderService.getOrders().subscribe(res => {
      this.orderAdmin = res;
    })
  }

  async changeChart() {
    this.datesOfMonth = this.getDatesOfMonth(this.yearClickedData, this.monthNumber);
    this.formattedDates = this.datesOfMonth.map(date => this.formatDate(date));
    let date: any[] = this.formattedDates;
    const sale: any = [];
    for (let i = 0; i < date.length; i++) {
      this.orderService.getOrderSaleCountByDate(date[i]).subscribe(res => {
        sale.push({ "date": date[i], "sale": res.sale });
      })
    }

    try {
      setTimeout(() => {
        this.createChart(sale)
      }, 500);
    }
    catch (err) {

    }

  }

  getDatesOfMonth(year: number, month: number): Date[] {
    const dates: Date[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get number of days in the month
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(new Date(year, month, day));
    }
    return dates;
  }

  monthClicked(monthNumber: number): void {
    this.monthNumber = monthNumber;
    let monthName: any = this.months.find((element) => element.number == monthNumber);
    this.monthName = monthName.name;
    this.chart.destroy();
    this.changeChart();

  }

  yearClicked(yearClicked: number) {
    this.yearClickedData = yearClicked;
    this.chart.destroy();
    this.changeChart();
  }


  getPastTenYears(): number[] {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 10; i++) {
      years.push(currentYear - i);
    }
    return years;
  }



  createChart(sale: any) {
    const labels = sale.map((item: any) => item.date);
    const sales = sale.map((item: any) => item.sale);
    this.chart = new Chart("MyChart", {
      type: 'line',

      data: {// values on X-Axis
        labels: labels,
        datasets: [
          {
            label: "Sales",
            data: sales,
            backgroundColor: 'blue'
          },
          // {
          //   label: "Profit",
          //   data: [],
          //   backgroundColor: 'limegreen'
          // }  
        ]
      },
      options: {
        onClick: (event, elements) => {
          if (elements.length > 0) {
              const element = elements[0];
              const datasetIndex = element.datasetIndex;
              const dataIndex = element.index;
              const dataset = this.chart.data.datasets[datasetIndex];
              const dataValue = dataset.data[dataIndex];
              const label = this.chart.data.labels[dataIndex];
              this.chartClick = true;
              this.getOderReportByDate(dataValue,label)
          }
        },
        aspectRatio: 2.5
      }

    });
  }


  getOderReportByDate(sale : any,date :any){
    if(sale == 0){
      alert('No Order for placed')
    }else{
      sessionStorage.setItem('orderDate', date);
      this.router.navigate(['/history'])
    }
 
  }


  prevSlide() {
    this.currentIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : this.images.length - 1;
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex < this.images.length - 1) ? this.currentIndex + 1 : 0;
  }
  ngOnDestroy() {
    if (this.slideInterval) {
      this.slideInterval.unsubscribe();
    }
  }

  startAutoSlide() {
    this.slideInterval = interval(3000).subscribe(() => { // Adjust the interval time as needed (3000 ms = 3 seconds)
      this.nextSlide();
    });
  }


  createChart1(jsonData :any){
  // Extract labels and data from JSON
  const labels = jsonData.map((item : any) => item.name);
  const data = jsonData.map((item :any) => parseInt(item.sale, 10)); // Convert sale to integer
  const backgroundColor = this.generateColors(jsonData.length);
    this.chart1 = new Chart("MyChart1", {
      type: 'pie', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: labels,
	       datasets: [{
    label: 'Sales Data',
    data: data,
    backgroundColor:  backgroundColor,
    hoverOffset: 4
  }],
      },
      options: {
        aspectRatio:2.5
      }

    });
  }

  generateColors(numColors : any) {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      colors.push(this.predefinedColors[i % this.predefinedColors.length]);
    }
    return colors;
  }

}
