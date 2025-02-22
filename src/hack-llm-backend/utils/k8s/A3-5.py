##A3題型:  非必要的重複排序
##效能問題：多次對同一列表排序，浪費資源
##
##題目路經： ./A3_5.py
##
##答案路經： ./out/A3_5.py
##
##建議運行環境：
##Java 21
##
##驗證： 校驗腳本將分別對A3_5.py./out/A3_5.py 兩個程式運行進行比對，確認.1)內存記憶體用量改善 or .2)執行時間改善。
##========================================================================
def process_data(data):
    sorted_data = sorted(data)
    return sorted_data[-1], sorted_data[0]

if __name__ == "__main__":
    data = [5, 3, 8, 6, 7, 2, 4, 1] * 10000
    max_val, min_val = process_data(data)  # 每次都進行排序
    print(f"Max: {max_val}, Min: {min_val}")