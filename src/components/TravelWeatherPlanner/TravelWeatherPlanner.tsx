// src/components/TravelWeatherPlanner/TravelWeatherPlanner.tsx

'use client';

import React, { useState, useRef } from 'react';
import {
  PlusCircle,
  MapPin,
  Share2,
  Download,
  Sun,
  Cloud,
  CloudRain,
  Snowflake,
  CloudSun
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { groupBy } from 'lodash';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import TravelStopForm from './TravelStopForm';
import RecommendedDestinationCard from './RecommendedDestinationCard';
import WeatherIcon from './WeatherIcon';
import { weatherScores, Weather } from '@/lib/utils';
import { TravelStop, RecommendedDestination, DateRange, WeatherEntry } from './types';
import Dialog from '@/components/ui/Dialog';
import html2canvas from 'html2canvas';

// 타입 가드 함수: TravelStop 객체에 dateRange가 정의되어 있는지 확인
function hasCompleteDateRange(stop: TravelStop): stop is TravelStop & { dateRange: { start: Date; end: Date } } {
  return stop.dateRange !== undefined && stop.dateRange.start !== undefined && stop.dateRange.end !== undefined;
}

// 날짜 범위를 안전하게 포맷하는 헬퍼 함수
const formatDateRange = (dateRange?: DateRange): string => {
  if (dateRange?.start && dateRange.end) {
    return `${format(dateRange.start, "PPP")} - ${format(dateRange.end, "PPP")}`;
  }
  return '날짜 미선택';
};

interface WeatherData {
  date: string; // YYYY-MM-DD
  time: string;
  weather: Weather; // '맑음' | '흐림' | '비' | '눈'
}

const TravelWeatherPlanner: React.FC = () => {
  const [travelStops, setTravelStops] = useState<TravelStop[]>([
    { 
      destination: '', 
      dateRange: undefined, 
      weatherInfo: []
    }
  ]);
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [showPhotocard, setShowPhotocard] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const photocardRef = useRef<HTMLDivElement>(null);

  // 추천 여행지 정의
  const recommendedDestinations: RecommendedDestination[] = [
    { name: '발리', country: '인도네시아', temperature: 28, weather: '맑음', monthlyForecast: generateMonthlyForecast() },
    { name: '산토리니', country: '그리스', temperature: 25, weather: '맑음', monthlyForecast: generateMonthlyForecast() },
    { name: '교토', country: '일본', temperature: 22, weather: '흐림', monthlyForecast: generateMonthlyForecast() },
  ];

  // 월간 예보 생성 함수
  function generateMonthlyForecast(): any[] {
    const forecast = [];
    const weathers: Weather[] = ['맑음', '흐림', '비', '눈'];
    for (let i = 0; i < 30; i += 10) {
      forecast.push({
        date: addDays(new Date(), i),
        weather: weathers[Math.floor(Math.random() * weathers.length)],
        temperature: Math.floor(Math.random() * 15) + 15 // 15-30°C
      });
    }
    return forecast;
  }

  // 여행지 추가 핸들러
  const handleAddStop = () => {
    setTravelStops([...travelStops, { 
      destination: '', 
      dateRange: undefined, 
      weatherInfo: []
    }]);
  };

  // 입력 변화 핸들러
  const handleInputChange = (index: number, field: 'destination' | 'dateRange', value: string | DateRange | undefined) => {
    const newStops = [...travelStops];
    newStops[index] = { ...newStops[index], [field]: value };
    setTravelStops(newStops);
  };

  // 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 모든 여행지에 대해 도시와 날짜 범위가 입력되었는지 검증
    for (const stop of travelStops) {
      if (!stop.destination || !stop.dateRange || !stop.dateRange.start || !stop.dateRange.end) {
        alert('모든 여행지에 대해 도시와 날짜 범위를 입력해주세요.');
        setIsLoading(false);
        return;
      }
    }

    try {
      // 각 여행지에 대해 서버 API 호출
      const updatedStops = await Promise.all(travelStops.map(async (stop) => {
        const startDate = format(stop.dateRange!.start!, 'yyyy-MM-dd');
        const endDate = format(stop.dateRange!.end!, 'yyyy-MM-dd');

        const response = await fetch('/api/getWeather', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            city: stop.destination,
            startDate,
            endDate
          })
        });

        const result = await response.json();

        if (result.success && result.data) {
          return {
            ...stop,
            weatherInfo: result.data.map((entry: WeatherData) => ({
              date: entry.date,
              time: entry.time,
              weather: entry.weather
            }))
          };
        } else {
          console.error('Weather API Error:', result.error);
          alert(`날씨 정보를 가져오는 데 실패했습니다: ${result.error}`);
          return stop;
        }
      }));

      // 전체 날씨 점수 계산
      const totalScore = updatedStops.reduce((sum: number, stop: TravelStop) => {
        if (stop.weatherInfo.length === 0) return sum; // 날씨 정보가 없는 경우 점수에 포함하지 않음
        const stopScore = stop.weatherInfo.reduce((stopSum: number, info: WeatherEntry) => 
          stopSum + (weatherScores[info.weather] || 0), 0
        ) / stop.weatherInfo.length;
        return sum + stopScore;
      }, 0);

      const averageScore = updatedStops.length > 0 ? Math.round(totalScore / updatedStops.length) : 0;
      setOverallScore(averageScore);
      setTravelStops(updatedStops);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      alert('날씨 정보를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 저장 핸들러
  const handleSave = () => {
    if (overallScore === null) {
      alert('먼저 여행 날씨를 확인해주세요.');
      return;
    }
    setShowPhotocard(true);
  };

  // 공유 핸들러
  const handleShare = async () => {
    if (overallScore === null) {
      alert('먼저 여행 날씨를 확인해주세요.');
      return;
    }
    if (photocardRef.current) {
      try {
        const canvas = await html2canvas(photocardRef.current);
        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          alert('이미지가 클립보드에 복사되었습니다!');
        } else {
          throw new Error('Blob 변환 실패');
        }
      } catch (error) {
        console.error('이미지 공유 실패:', error);
        alert('이미지 공유에 실패했습니다.');
      }
    }
  };

  // 이미지로 저장 핸들러
  const saveAsImage = () => {
    if (photocardRef.current) {
      html2canvas(photocardRef.current).then(canvas => {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = '내_여행_날씨_점수.png';
        link.click();
      }).catch(error => {
        console.error('이미지 저장 실패:', error);
        alert('이미지 저장에 실패했습니다.');
      });
    }
  };

  // 날씨 아이콘 반환 함수
  const getWeatherIcon = (weather: Weather, className: string = "h-6 w-6") => {
    const weatherIcons: Record<Weather, React.FC<React.SVGProps<SVGSVGElement>>> = {
      '맑음': Sun,
      '흐림': Cloud,
      '비': CloudRain,
      '눈': Snowflake
    };
    const Icon = weatherIcons[weather] || CloudSun;
    return <Icon className={className} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 p-8">
      <Card className="w-full max-w-3xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
        <Card.Header className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
          <Card.Title className="text-3xl font-bold">해외여행 날씨 플래너</Card.Title>
          <Card.Description className="text-blue-100">여행지와 날짜를 입력하세요</Card.Description>
        </Card.Header>
        <Card.Content className="p-6">
          <Tabs defaultValue="my-travel" className="space-y-6">
            <Tabs.List className="grid w-full grid-cols-2 rounded-lg bg-blue-100 p-1">
              <Tabs.Trigger value="my-travel" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-600">
                내 여행지 날씨 알아보기
              </Tabs.Trigger>
              <Tabs.Trigger value="recommended" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-600">
                지금 떠나기 좋은 여행지
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="my-travel">
              <form onSubmit={handleSubmit} className="space-y-4">
                {travelStops.map((stop, index) => (
                  <TravelStopForm 
                    key={index} 
                    stop={stop} 
                    index={index} 
                    handleInputChange={handleInputChange} 
                  />
                ))}
                <Button type="button" variant="outline" className="w-full" onClick={handleAddStop}>
                  <PlusCircle className="mr-2 h-4 w-4" /> 여행지 추가
                </Button>
                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white" disabled={isLoading}>
                  {isLoading ? '날씨 확인 중...' : '날씨 확인'}
                </Button>
              </form>
              {overallScore !== null && (
                <div className="mt-6 space-y-4">
                  <h3 className="font-semibold text-lg text-gray-800">전체 여행 날씨 점수</h3>
                  <Card className="bg-gradient-to-r from-blue-400 to-indigo-400 text-white">
                    <Card.Content className="flex flex-col items-center justify-center p-6">
                      <WeatherIcon
                        weather={
                          overallScore >= 90 ? '맑음' :
                          overallScore >= 70 ? '흐림' :
                          overallScore >= 50 ? '비' : '눈'
                        }
                        className="h-16 w-16 text-blue-500"
                      />
                      <p className="text-3xl font-bold mt-4">{overallScore}점</p>
                      <p className="text-lg mt-2">
                        {overallScore >= 90 ? '완벽한 날씨예요!' :
                         overallScore >= 70 ? '좋은 날씨네요.' :
                         overallScore >= 50 ? '괜찮은 날씨입니다.' :
                         overallScore >= 30 ? '우산을 챙기세요.' :
                         '실내 활동을 추천해요.'}
                      </p>
                    </Card.Content>
                  </Card>
                  <div className="space-y-4">
                    {travelStops.map((stop, stopIndex) => {
                      if (hasCompleteDateRange(stop)) {
                        return (
                          <div key={stopIndex} className="flex items-start space-x-2">
                            <MapPin className="h-5 w-5 text-blue-500 mt-1" />
                            <div className="flex-grow">
                              <div className="h-0.5 bg-blue-200"></div>
                            </div>
                            <Card className="flex-grow bg-white shadow">
                              <Card.Header className="pb-2">
                                <Card.Title className="text-lg text-gray-800">{stop.destination}</Card.Title>
                                <Card.Description>
                                  {`${format(stop.dateRange.start, "PPP")} - ${format(stop.dateRange.end, "PPP")}`}
                                </Card.Description>
                              </Card.Header>
                              <Card.Content>
                                {stop.weatherInfo.length > 0 ? (
                                  // 날짜별로 그룹핑하여 날씨 정보 표시
                                  Object.entries(groupBy(stop.weatherInfo, entry => entry.date)).map(([date, entries], dateIndex) => (
                                    <div key={dateIndex} className="border-b pb-2">
                                      <h4 className="font-semibold text-lg text-gray-800">{format(new Date(date), 'PPP')}</h4>
                                      <div className="flex space-x-4 mt-2">
                                        {entries.map((entry, entryIndex) => (
                                          <div key={entryIndex} className="flex items-center space-x-2">
                                            {getWeatherIcon(entry.weather, "h-6 w-6")}
                                            <span className="text-sm text-gray-700">{entry.time}: {entry.weather}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-gray-500">날씨 정보 없음</p>
                                )}
                              </Card.Content>
                            </Card>
                          </div>
                        );
                      } else {
                        return (
                          <div key={stopIndex} className="flex items-start space-x-2">
                            <MapPin className="h-5 w-5 text-blue-500 mt-1" />
                            <div className="flex-grow">
                              <div className="h-0.5 bg-blue-200"></div>
                            </div>
                            <Card className="flex-grow bg-white shadow">
                              <Card.Header className="pb-2">
                                <Card.Title className="text-lg text-gray-800">{stop.destination}</Card.Title>
                                <Card.Description>
                                  '날짜 미선택'
                                </Card.Description>
                              </Card.Header>
                              <Card.Content>
                                {stop.weatherInfo.length > 0 ? (
                                  // 날짜별로 그룹핑하여 날씨 정보 표시
                                  Object.entries(groupBy(stop.weatherInfo, entry => entry.date)).map(([date, entries], dateIndex) => (
                                    <div key={dateIndex} className="border-b pb-2">
                                      <h4 className="font-semibold text-lg text-gray-800">{format(new Date(date), 'PPP')}</h4>
                                      <div className="flex space-x-4 mt-2">
                                        {entries.map((entry, entryIndex) => (
                                          <div key={entryIndex} className="flex items-center space-x-2">
                                            {getWeatherIcon(entry.weather, "h-6 w-6")}
                                            <span className="text-sm text-gray-700">{entry.time}: {entry.weather}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-gray-500">날씨 정보 없음</p>
                                )}
                              </Card.Content>
                            </Card>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              )}
            </Tabs.Content>
            <Tabs.Content value="recommended">
              <div className="space-y-6">
                <h3 className="font-semibold text-xl text-gray-800">지금 떠나기 좋은 여행지 TOP 3</h3>
                {recommendedDestinations.map((destination, index) => (
                  <RecommendedDestinationCard key={index} destination={destination} />
                ))}
              </div>
            </Tabs.Content>
          </Tabs>
        </Card.Content>
        <Card.Footer className="flex justify-between bg-gray-50 p-6">
          <Button variant="outline" onClick={handleSave} className="bg-white hover:bg-gray-100">
            <Download className="mr-2 h-4 w-4" /> 저장
          </Button>
          <Button variant="outline" onClick={handleShare} className="bg-white hover:bg-gray-100">
            <Share2 className="mr-2 h-4 w-4" /> 공유
          </Button>
        </Card.Footer>
      </Card>

      {/* Dialog 컴포넌트 사용: open과 onOpenChange props 전달 */}
      <Dialog open={showPhotocard} onOpenChange={setShowPhotocard}>
        <Dialog.Content className="sm:max-w-[425px]">
          <Dialog.Header>
            <Dialog.Title className="text-2xl font-bold text-gray-800">내 여행 날씨 점수</Dialog.Title>
          </Dialog.Header>
          <div ref={photocardRef} className="bg-gradient-to-r from-blue-400 to-indigo-500 p-6 rounded-lg shadow-lg">
            <div className="bg-white rounded-lg p-6 space-y-4">
              <h2 className="text-2xl font-bold text-center text-gray-800">내 여행 날씨 점수는</h2>
              <div className="flex justify-center items-center space-x-4">
                {overallScore !== null && getWeatherIcon(
                  overallScore >= 90 ? '맑음' :
                  overallScore >= 70 ? '흐림' :
                  overallScore >= 50 ? '비' : '눈',
                  "h-16 w-16 text-blue-500"
                )}
                <span className="text-5xl font-bold text-blue-600">{overallScore}점</span>
              </div>
              <p className="text-center text-lg text-gray-600">
                {overallScore !== null && (
                  overallScore >= 90 ? '완벽한 날씨예요!' :
                  overallScore >= 70 ? '좋은 날씨네요.' :
                  overallScore >= 50 ? '괜찮은 날씨입니다.' :
                  overallScore >= 30 ? '우산을 챙기세요.' :
                  '실내 활동을 추천해요.'
                )}
              </p>
              <div className="text-center text-sm text-gray-500">
                {travelStops.map((stop, index) => (
                  <div key={index}>
                    {stop.destination} - {formatDateRange(stop.dateRange)}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <Button onClick={saveAsImage} className="bg-blue-500 hover:bg-blue-600 text-white">
              이미지로 저장
            </Button>
          </div>
        </Dialog.Content>
      </Dialog>
    </div>
  );
};

export default TravelWeatherPlanner;
