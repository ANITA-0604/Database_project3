# routes/items.py
from flask import Blueprint, request, jsonify
from utils.db import get_db_connection

items_bp = Blueprint('items', __name__, url_prefix='/items')

@items_bp.route('/find', methods=['GET','POST'])
def find_item():
    item_id = request.args.get('itemID')
    if not item_id:
        return jsonify({'error': 'itemID is required'}), 400

    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            # 改进的 SQL 查询
            sql = """
                SELECT 
                    Piece.pieceNum,
                    Piece.roomNum,
                    Piece.shelfNum as shelfNum,
                    Piece.pNotes AS notes
                FROM Piece
                WHERE Piece.itemID = %s
            """
            cursor.execute(sql, (item_id,))
            locations = cursor.fetchall()

            # 如果没有找到结果
            if not locations:
                return jsonify({'message': 'No pieces found for the given itemID'}), 404

            # 将结果转换为 JSON 格式
            result = []
            print(locations)
            for row in locations:
                result.append({
                    'pieceNum': row['pieceNum'],
                    'roomNum': row['roomNum'],
                    'shelf': row['shelfNum'],
                    'notes': row['notes']
                })

            return jsonify({'pieces': result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        connection.close()
